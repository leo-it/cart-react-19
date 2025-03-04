import "./App.css";

import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Product } from "./types/types";
import { fetchProducts } from "./utils/api";
import { useCart } from "./hooks/useCart";

function App() {
  const [num1, setNum1] = useState<string>("");
  const [num2, setNum2] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { cart, addToCart, updateQuantity, removeItem, calculateTotal } =
    useCart();
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
      setError("Producto no encontrado. Verifica el ID.");
      return;
    }

    setError(null);
    const quantity = Math.min(parseInt(num2), 10);
    addToCart({ ...product, quantity });
    setNum1("");
    setNum2("");
  };

  const handleNum1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNum1(e.target.value);
    if (error) {
      setError(null);
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
          Completa los campos y envía la solicitud para agregar productos a tu
          carrito.
        </Typography>

        <Grid container spacing={4} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <Typography variant="h6" gutterBottom>
                    Agregar al carrito
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="ID del Producto"
                        type="number"
                        inputProps={{ min: 1 }}
                        value={num1}
                        onChange={handleNum1Change}
                        fullWidth
                        margin="normal" 
                        required
                        sx={{
                          boxShadow: 1,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Cantidad"
                        type="number"
                        inputProps={{ min: 1 }}
                        value={num2}
                        onChange={(e) => setNum2(e.target.value)}
                        fullWidth 
                        margin="normal"
                        required
                        sx={{
                          boxShadow: 1,
                        }}
                      />
                    </Grid>
                  </Grid>
                  {error && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                      {error}
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Agregar al carrito
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <CardContent>
                {cart.length > 0 ? (
                  <>
                    <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                      Productos en el carrito:
                    </Typography>

                    <Box
                      sx={{
                        maxHeight: "300px",
                        overflowY: "auto",
                        mt: 2,
                      }}
                    >
                      <Grid container spacing={2}>
                        {cart.map((item) => (
                          <Grid item xs={12} md={12} key={item.id}>
                            <Card
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "left",
                                boxShadow: 1,
                                mb: 2,
                                background: "rgba(227, 250, 250, 0.5)",
                              }}
                            >
                              <CardContent
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  width: "100%",
                                }}
                              >
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  style={{ width: "50px", height: "50px" }}
                                />
                                <div>
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      display: "flex",
                                      textAlign: "left",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    Id item: {item.id}
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      display: "flex",
                                      textAlign: "left",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {item.title}
                                  </Typography>
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    sx={{ gap: "8px" }}
                                  >
                                    <Typography
                                      variant="body1" 
                                      sx={{
                                        marginRight: "8px", 
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      Cantidad:
                                    </Typography>

                                    <TextField  variant="standard"
                                      type="number"
                                      value={item.quantity}
                                      onChange={
                                        (e) =>
                                          updateQuantity(
                                            item.id,
                                            Math.min(
                                              parseInt(e.target.value),
                                              10
                                            )
                                          )
                                      }
                                      inputProps={{ min: 1 }}
                                      sx={{
                                        width: "50px",
                                        height: "30px",
                                        fontSize: "0.875rem",
                                        padding: "0 5px",
                                      }}
                                    />

                                    <Typography
                                      variant="body2"
                                      sx={{ marginLeft: "8px" }}
                                    >
                                      Precio: ${item.price}
                                    </Typography>

                                    <Button
                                      variant="outlined"
                                      color="secondary"
                                      sx={{
                                      }}
                                      onClick={() => removeItem(item.id)}
                                    >
                                      X
                                    </Button>
                                    <DeleteForeverIcon   onClick={() => removeItem(item.id)} />

                                  </Box>
                                </div>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>

                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Total: ${calculateTotal()}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="h5" align="center">
                      ¡Tu carrito está vacío!
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      align="center"
                      sx={{ mt: 1 }}
                    >
                      Para comenzar, ingresa el <strong>ID del producto</strong>{" "}
                      y la <strong>cantidad</strong> que deseas agregar a tu
                      carrito.
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
