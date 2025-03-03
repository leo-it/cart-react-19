import "./App.css";

import { AppBar, Button, Card, CardContent, Container, Grid, TextField, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { Product } from "./types/types";
import { fetchProducts } from "./utils/api"; // Importar la función de API
import { useCart } from "./hooks/useCart";

function App() {
  const [num1, setNum1] = useState<string>("");
  const [num2, setNum2] = useState<string>("");
  const [error, setError] = useState<string | null>(null); // Estado para manejar el error
  const { cart, addToCart, updateQuantity, removeItem, calculateTotal } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getProducts();
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const product = products.find((p) => p.id === parseInt(num1));

    if (!product) {
      setError("Producto no encontrado. Verifica el ID."); // Establecer el error
      return;
    }

    setError(null); // Limpiar el error si el producto se encuentra
    addToCart({ ...product, quantity: parseInt(num2) });
    setNum1("");
    setNum2("");
  };

  // Limpiar el error cuando se escribe un nuevo número
  const handleNum1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNum1(e.target.value);
    if (error) {
      setError(null); // Limpiar error si el usuario escribe algo nuevo
    }
  };

  return (
    <>
      <head>
        <title>Tienda - Tu Tienda de Tecnología y Accesorios</title>
      </head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Tienda</Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Bienvenido a Tienda
        </Typography>
        <Typography variant="subtitle1">
          Completa los campos y envía la solicitud para agregar productos a tu carrito.
        </Typography>

        <Grid container spacing={4} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <Typography variant="h6" gutterBottom>
                    Agregar al carrito
                  </Typography>
                  <TextField
                    label="ID del Producto"
                    type="number"
                    inputProps={{ min: 1 }}
                    value={num1}
                    onChange={handleNum1Change} // Llamada a la nueva función
                    fullWidth
                    margin="normal"
                    required
                  />
                  {error && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                      {error}
                    </Typography>
                  )}
                  <TextField
                    label="Cantidad"
                    type="number"
                    inputProps={{ min: 1 }}
                    value={num2}
                    onChange={(e) => setNum2(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                  />
                  <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
                    Agregar al carrito
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <CardContent>
                {/* Si el carrito tiene productos, mostramos los productos */}
                {cart.length > 0 ? (
                  <>
                    <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                      Productos en el carrito:
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      {cart.map((item) => (
                        <Grid item xs={12} md={6} key={item.id}>
                          <Card>
                            <CardContent>
                              <Typography variant="h6">{item.title}</Typography>
                              <Typography variant="body1">
                                Cantidad:{" "}
                                <TextField
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateQuantity(item.id, parseInt(e.target.value))
                                  }
                                  inputProps={{ min: 1 }}
                                  sx={{ width: "60px", marginLeft: "10px" }}
                                />
                              </Typography>
                              <Typography variant="body2">Precio: ${item.price}</Typography>
                              <img src={item.image} alt={item.title} style={{ width: "100px", height: "100px" }} />
                              <Button
                                variant="outlined"
                                color="secondary"
                                sx={{ mt: 2 }}
                                onClick={() => removeItem(item.id)}
                              >
                                Eliminar
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Total: ${calculateTotal()}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="h5" align="center">
                      ¡Tu carrito está vacío!
                    </Typography>
                    <Typography variant="subtitle1" align="center" sx={{ mt: 1 }}>
                      Para comenzar, ingresa el <strong>ID del producto</strong> y la <strong>cantidad</strong> que deseas agregar a tu carrito.
                      <br />
                      Una vez que lo hayas hecho, el producto aparecerá aquí.
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default App;
