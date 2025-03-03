import { Product } from "../types/types";
import axios from "axios";

// URL base de la API (puedes modificarla si es necesario)
const API_URL = "https://fakestoreapi.com/products";

// Función para obtener todos los productos
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; 
  }
};
