const app = Vue.createApp({
  data() {
    return {
      productos: [],
      filtro: "",
      generoSeleccionado: "",
      dropdownVisible: false,
      totalElementos: 0,
    };
  },
  computed: {
    productosFiltrados() {
      return this.productos.filter(producto => {
        const coincideNombre = producto.name.toLowerCase().includes(this.filtro.toLowerCase());
        const coincideGenero = !this.generoSeleccionado || producto.gender === this.generoSeleccionado;
        return coincideNombre && coincideGenero;
      });
    },
    progreso() {
      return Math.min((this.totalElementos / 10) * 100, 100);
    },
  },
  methods: {
    async obtenerProductos() {
      try {
        const respuesta = await axios.get("https://rickandmortyapi.com/api/character");
        this.productos = respuesta.data.results.map(personaje => ({
          id: personaje.id,
          name: personaje.name,
          image: personaje.image,
          gender: personaje.gender,
        }));
      } catch (error) {
        console.error("Error al obtener los personajes:", error);
      }
    },
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    closeDropdown() {
      this.dropdownVisible = false;
    },
    seleccionarGenero(genero) {
      this.generoSeleccionado = genero;
      this.closeDropdown();
    },
    agregarAlCarrito(producto) {
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const item = carrito.find(p => p.id === producto.id);

      if (item) {
        item.cantidad++;
      } else {
        carrito.push({ ...producto, cantidad: 1 });
      }

      localStorage.setItem("carrito", JSON.stringify(carrito));
      this.actualizarContador();
    },
    disminuirCantidad(producto) {
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const item = carrito.find(p => p.id === producto.id);

      if (item && item.cantidad > 1) {
        item.cantidad--;
      } else if (item) {
        this.eliminarDelCarrito(producto);
      }
      localStorage.setItem("carrito", JSON.stringify(carrito));
      this.actualizarContador();
    },
    eliminarDelCarrito(producto) {
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      carrito = carrito.filter(p => p.id !== producto.id);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      this.actualizarContador();
    },
    actualizarContador() {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      this.totalElementos = carrito.reduce((total, item) => total + item.cantidad, 0);
    },
  },
  mounted() {
    this.obtenerProductos();
    this.actualizarContador();
  },
});

app.mount("#app");
