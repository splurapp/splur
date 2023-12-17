import db from "./db";
import type { Category } from "./schema";

export class CategoryOperations {
  static getObj(categories: Category[], id: number): Category | undefined {
    return categories.find(item => item.id === id);
  }

  static async get(): Promise<Category[]> {
    return await db.categories.toArray();
  }

  static async getById(id?: number): Promise<Category | undefined> {
    if (!id) throw new Error("ID not provided");
    return await db.categories.get(id);
  }

  static async add(category: Category): Promise<Category> {
    return db.transaction("rw", db.categories, async () => {
      try {
        category.id = undefined;
        const objectIndex = await db.categories.add(category);
        const newCategory = await this.getById(objectIndex as number);

        if (!newCategory) throw new Error("Category creation failed");

        return newCategory;
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
  }

  static async bulkAdd(categories: Category[]): Promise<boolean> {
    return db.transaction("rw", db.categories, async () => {
      try {
        const objs = categories.map(item => {
          item.id = undefined;
          return item;
        });

        const ret = await db.categories.bulkAdd(objs);

        if (ret !== objs.length) throw new Error("Failed to create categories");

        return true;
      } catch (error) {
        console.log(error);
        // return null;
        throw error;
      }
    });
  }

  static async edit(category: Category): Promise<Category> {
    return db.transaction("rw", db.categories, async () => {
      try {
        if (!category.id) throw new Error("No id provided inside category object");

        await db.categories.update(category.id, {
          name: category.name,
          icon: category.icon,
          color: category.color,
        });

        const newCategory = await this.getById(category.id);

        if (newCategory) newCategory;
        throw new Error("Category creation failed");
      } catch (error) {
        console.log(error);
        // return null;
        throw error;
      }
    });
  }

  static async delete(categoryId?: number): Promise<number> {
    return db.transaction("rw", db.categories, db.splurTransactions, async () => {
      try {
        if (!categoryId) throw new Error("No id provided");

        await db.categories.delete(categoryId);

        // Updating transaction records
        const records = await db.splurTransactions.where("categoryId").equals(categoryId).toArray();
        const updatedRecords = records.map(item => {
          item.categoryId = undefined;
          return item;
        });
        await db.splurTransactions.bulkPut(updatedRecords);

        return categoryId;
      } catch (error) {
        console.log(error);
        // return null;
        throw error;
      }
    });
  }
}
