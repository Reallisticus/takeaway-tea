import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const menuRouter = createTRPCRouter({
  // Public procedures - accessible to everyone
  getCategories: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.category.findMany({
      orderBy: { sortOrder: "asc" },
    });
  }),

  getMenuItems: publicProcedure
    .input(
      z
        .object({
          categoryId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const where = input?.categoryId ? { categoryId: input.categoryId } : {};

      return ctx.db.menuItem.findMany({
        where: {
          ...where,
          isActive: true,
        },
        include: {
          category: true,
        },
        orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
      });
    }),

  getDailyMenu: publicProcedure
    .input(
      z
        .object({
          date: z.date().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const date = input?.date || new Date();

      // Format date to compare only year-month-day
      const formattedDate = new Date(date);
      formattedDate.setHours(0, 0, 0, 0);

      const dailyMenu = await ctx.db.dailyMenu.findFirst({
        where: {
          date: formattedDate,
          isActive: true,
        },
        include: {
          menuItems: {
            include: {
              menuItem: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });

      if (!dailyMenu) {
        return null;
      }

      return {
        ...dailyMenu,
        menuItems: dailyMenu.menuItems.map((item) => ({
          id: item.menuItem.id,
          name: item.menuItem.name,
          description: item.menuItem.description,
          price: item.specialPrice || item.menuItem.price,
          imageUrl: item.menuItem.imageUrl,
          category: item.menuItem.category,
          specialPrice: item.specialPrice,
        })),
      };
    }),

  // Protected procedures - only accessible to admin
  createCategory: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        nameEn: z.string().min(1),
        sortOrder: z.number().default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.category.create({
        data: input,
      });
    }),

  updateCategory: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        nameEn: z.string().min(1),
        sortOrder: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      return ctx.db.category.update({
        where: { id },
        data,
      });
    }),

  createMenuItem: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.number().positive(),
        imageUrl: z.string().optional(),
        categoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.menuItem.create({
        data: {
          ...input,
          price: input.price,
        },
      });
    }),

  updateMenuItem: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.number().positive(),
        imageUrl: z.string().optional(),
        categoryId: z.string(),
        isActive: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      return ctx.db.menuItem.update({
        where: { id },
        data: {
          ...data,
          price: data.price,
        },
      });
    }),

  createOrUpdateDailyMenu: publicProcedure
    .input(
      z.object({
        date: z.date(),
        menuItems: z.array(
          z.object({
            menuItemId: z.string(),
            specialPrice: z.number().positive().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Format date to ensure consistent comparison
      const formattedDate = new Date(input.date);
      formattedDate.setHours(0, 0, 0, 0);

      // Check if menu for this date already exists
      const existingMenu = await ctx.db.dailyMenu.findFirst({
        where: { date: formattedDate },
      });

      if (existingMenu) {
        // Delete existing menu items and recreate them
        await ctx.db.dailyMenuItem.deleteMany({
          where: { dailyMenuId: existingMenu.id },
        });

        // Update existing menu
        await ctx.db.dailyMenu.update({
          where: { id: existingMenu.id },
          data: {
            isActive: true,
            updatedAt: new Date(),
          },
        });

        // Create new menu items
        for (const item of input.menuItems) {
          await ctx.db.dailyMenuItem.create({
            data: {
              dailyMenuId: existingMenu.id,
              menuItemId: item.menuItemId,
              specialPrice: item.specialPrice || null,
            },
          });
        }

        return existingMenu;
      } else {
        // Create new daily menu
        const newMenu = await ctx.db.dailyMenu.create({
          data: {
            date: formattedDate,
            isActive: true,
          },
        });

        // Create menu items
        for (const item of input.menuItems) {
          await ctx.db.dailyMenuItem.create({
            data: {
              dailyMenuId: newMenu.id,
              menuItemId: item.menuItemId,
              specialPrice: item.specialPrice || null,
            },
          });
        }

        return newMenu;
      }
    }),

  deleteDailyMenu: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.dailyMenuItem.deleteMany({
        where: { dailyMenuId: input.id },
      });

      return ctx.db.dailyMenu.delete({
        where: { id: input.id },
      });
    }),
});
