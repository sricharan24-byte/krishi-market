document.addEventListener("DOMContentLoaded", function () {

    const cartItemsContainer =
        document.getElementById("cartItems");

    const emptyCart =
        document.getElementById("emptyCart");

    const subtotalElement =
        document.getElementById("subtotal");

    const deliveryElement =
        document.getElementById("delivery");

    const totalElement =
        document.getElementById("total");

    const cartCount =
        document.getElementById("cartCount");


    // Get cart from Local Storage

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    // Display Cart

    function displayCart() {

        cartItemsContainer.innerHTML = "";


        // Empty Cart

        if (cart.length === 0) {

            emptyCart.style.display = "block";

            subtotalElement.textContent =
                "0.00";

            deliveryElement.textContent =
                "0.00";

            totalElement.textContent =
                "0.00";

            if (cartCount) {
                cartCount.textContent = "0";
            }

            return;
        }


        emptyCart.style.display = "none";


        let subtotal = 0;

        let totalQuantity = 0;


        cart.forEach(function (item, index) {

            const quantity =
                item.quantity || 1;


            const price =
                Number(item.price) || 0;


            subtotal +=
                price * quantity;


            totalQuantity +=
                quantity;


            const cartItem =
                document.createElement("div");


            cartItem.className =
                "cart-item";


            cartItem.innerHTML = `

                <img
                    src="${item.image || 'assets/default-product.jpg'}"
                    class="cart-item-image"
                    alt="${item.name}"
                >


                <div class="cart-item-info">

                    <h3>
                        ${item.name}
                    </h3>

                    <p>
                        ${item.description || "Fresh agricultural product"}
                    </p>

                </div>


                <div class="cart-item-price">

                    $${price.toFixed(2)}

                </div>


                <div class="quantity-controls">

                    <button
                        onclick="decreaseQuantity(${index})"
                    >
                        −
                    </button>


                    <span>
                        ${quantity}
                    </span>


                    <button
                        onclick="increaseQuantity(${index})"
                    >
                        +
                    </button>

                </div>


                <button
                    class="remove-btn"
                    onclick="removeFromCart(${index})"
                >
                    Remove
                </button>

            `;


            cartItemsContainer.appendChild(
                cartItem
            );

        });


        // Delivery

        const delivery =
            subtotal > 0
                ? 50
                : 0;


        const total =
            subtotal + delivery;


        subtotalElement.textContent =
            subtotal.toFixed(2);


        deliveryElement.textContent =
            delivery.toFixed(2);


        totalElement.textContent =
            total.toFixed(2);


        if (cartCount) {

            cartCount.textContent =
                totalQuantity;

        }

    }


    // Increase Quantity

    window.increaseQuantity =
        function (index) {

            cart[index].quantity =
                (cart[index].quantity || 1) + 1;


            saveCart();

        };


    // Decrease Quantity

    window.decreaseQuantity =
        function (index) {

            if (
                (cart[index].quantity || 1)
                > 1
            ) {

                cart[index].quantity--;

            }


            saveCart();

        };


    // Remove Item

    window.removeFromCart =
        function (index) {

            cart.splice(index, 1);

            saveCart();

        };


    // Save Cart

    function saveCart() {

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        displayCart();

    }


    // Checkout

    document
        .getElementById("checkoutButton")
        .addEventListener(
            "click",
            function () {

                if (cart.length === 0) {

                    alert(
                        "Your cart is empty."
                    );

                    return;

                }


                window.location.href =
                    "checkout.html";

            }
        );


    // Initial Load

    displayCart();

});