import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';

export interface Ingredient {
  id: string;
  name: string;
  categories: string[];
  quantity: number;
  unit: string;
  expiryDate: string;
  addedDate: string;
  tags?: string[];
  userId?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: { name: string; quantity: number; unit: string }[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  tags: string[];
  image?: string;
  isUserCreated?: boolean;
  userId?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface MealPlan {
  id: string;
  date: string;
  recipe: Recipe;
  servings: number;
  userId?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  completed: boolean;
  userId?: string;
  createdAt?: any;
  updatedAt?: any;
}

interface AppContextType {
  // Auth
  user: any;
  authLoading: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  
  // Ingredients
  ingredients: Ingredient[];
  ingredientsLoading: boolean;
  ingredientsError: string | null;
  addIngredient: (ingredient: Omit<Ingredient, 'id'>) => Promise<string>;
  updateIngredient: (id: string, updates: Partial<Ingredient>) => Promise<void>;
  deleteIngredient: (id: string) => Promise<void>;
  
  // Recipes
  recipes: Recipe[];
  recipesLoading: boolean;
  recipesError: string | null;
  addRecipe: (recipe: Omit<Recipe, 'id'>) => Promise<string>;
  updateRecipe: (id: string, updates: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  
  // Meal Plans
  mealPlans: MealPlan[];
  mealPlansLoading: boolean;
  mealPlansError: string | null;
  addMealPlan: (mealPlan: Omit<MealPlan, 'id'>) => Promise<string>;
  updateMealPlan: (id: string, updates: Partial<MealPlan>) => Promise<void>;
  deleteMealPlan: (id: string) => Promise<void>;
  
  // Shopping List
  shoppingList: ShoppingItem[];
  shoppingListLoading: boolean;
  shoppingListError: string | null;
  addShoppingItem: (item: Omit<ShoppingItem, 'id'>) => Promise<string>;
  updateShoppingItem: (id: string, updates: Partial<ShoppingItem>) => Promise<void>;
  deleteShoppingItem: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const ingredients = useFirestore<Ingredient>('ingredients');
  const recipes = useFirestore<Recipe>('recipes');
  const mealPlans = useFirestore<MealPlan>('mealPlans');
  const shoppingList = useFirestore<ShoppingItem>('shoppingList');

  const contextValue: AppContextType = {
    // Auth
    user: auth.user,
    authLoading: auth.loading,
    authError: auth.error,
    signIn: auth.signIn,
    signUp: auth.signUp,
    signOut: auth.signOut,
    
    // Ingredients
    ingredients: ingredients.data,
    ingredientsLoading: ingredients.loading,
    ingredientsError: ingredients.error,
    addIngredient: ingredients.add,
    updateIngredient: ingredients.update,
    deleteIngredient: ingredients.remove,
    
    // Recipes
    recipes: recipes.data,
    recipesLoading: recipes.loading,
    recipesError: recipes.error,
    addRecipe: recipes.add,
    updateRecipe: recipes.update,
    deleteRecipe: recipes.remove,
    
    // Meal Plans
    mealPlans: mealPlans.data,
    mealPlansLoading: mealPlans.loading,
    mealPlansError: mealPlans.error,
    addMealPlan: mealPlans.add,
    updateMealPlan: mealPlans.update,
    deleteMealPlan: mealPlans.remove,
    
    // Shopping List
    shoppingList: shoppingList.data,
    shoppingListLoading: shoppingList.loading,
    shoppingListError: shoppingList.error,
    addShoppingItem: shoppingList.add,
    updateShoppingItem: shoppingList.update,
    deleteShoppingItem: shoppingList.remove,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
