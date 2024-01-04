document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Web Develoment", img: "1.jpeg", price: 500000 },
      { id: 2, name: "Ilustrasi", img: "3.png", price: 10000 },
      {
        id: 3,
        name: "Graphic Design",
        img: "4.png",
        price: 50000,
      },
      { id: 4, name: "Logo", img: "5.jpg", price: 100000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek barang sama
      const cartItem = this.items.find((item) => item.id === newItem.id);
      // jika belum
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        this.items = this.items.map((item) => {
          if (item.id !== newItem.id) {
            return item;
          } else {
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      const cartItem = this.items.find((item) => item.id === id);

      if (cartItem.quantity > 1) {
        this.items = this.items.map((item) => {
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// validasi
const checkoutButon = document.querySelector(".checkout-buton");
checkoutButon.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButon.classList.remove("disabled");
      checkoutButon.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButon.disabled = false;
  checkoutButon.classList.remove("disabled");
});

// back end data
checkoutButon.addEventListener("click", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMessage(objData);
  window.open("http://wa.me/6285702317458?text=" + encodeURIComponent(message));
});

// Format masage
const formatMessage = (obj) => {
  return `Pelanggan
  Nama: ${obj.nama}
  Email: ${obj.email}
  No. HP: ${obj.phone}
  DATA PESANAN
  ${JSON.parse(obj.items).map(
    (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`
  )}
  TOTAL: ${rupiah(obj.total)}
  Terima Kasih.`;
};
// currency

const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    // minimumFractionDigits: 0,
  }).format(number);
};
