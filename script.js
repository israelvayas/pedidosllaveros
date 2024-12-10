body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f4f4f9;
    color: #333;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}

form {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
}

form input, form button {
    padding: 10px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #ccc;
}

form button {
    background-color: #3498db;
    color: white;
    border: none;
    cursor: pointer;
}

form button:hover {
    background-color: #2980b9;
}

.boton-rojo {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 5px;
    font-size: 16px;
    margin-bottom: 20px;
}

.boton-rojo:hover {
    background-color: #c0392b;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    font-size: 16px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

table th, table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
}

table th {
    background-color: #2c3e50;
    color: white;
}

table tr:nth-child(even) {
    background-color: #ecf0f1;
}
// Recuperar los pedidos del almacenamiento local al cargar la página
window.addEventListener('load', function() {
    cargarPedidos();
});

// Función para agregar un pedido
document.getElementById('pedidoForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const personaje = document.getElementById('personaje').value;
    const cantidad = document.getElementById('cantidad').value;
    const total = document.getElementById('total').value;
    const cliente = document.getElementById('cliente').value;
    const fechaEntrega = document.getElementById('fechaEntrega').value;
    const fecha = new Date().toLocaleDateString();

    const pedido = {
        fecha,
        personaje,
        cantidad,
        total,
        cliente,
        fechaEntrega,
        pagado: false
    };

    agregarPedido(pedido);

    // Limpiar el formulario después de agregar
    document.getElementById('pedidoForm').reset();
});

// Función para agregar un pedido a la tabla y al almacenamiento local
function agregarPedido(pedido) {
    const pedidoLista = document.getElementById('pedidoLista');
    const fila = document.createElement('tr');

    fila.innerHTML = `
        <td>${pedido.fecha}</td>
        <td>${pedido.personaje}</td>
        <td>${pedido.cantidad}</td>
        <td>$${pedido.total}</td>
        <td>${pedido.cliente}</td>
        <td>${pedido.fechaEntrega}</td>
        <td>
            <input type="checkbox" class="checkPagado" ${pedido.pagado ? 'checked' : ''}>
        </td>
        <td><button class="eliminarPedido">Eliminar</button></td>
    `;

    // Agregar evento para marcar como pagado
    fila.querySelector('.checkPagado').addEventListener('change', function() {
        pedido.pagado = this.checked;
        if (pedido.pagado) {
            fila.classList.add('pagado');
        } else {
            fila.classList.remove('pagado');
        }
        actualizarTotales();
        guardarPedidos();
    });

    // Agregar evento para eliminar pedido
    fila.querySelector('.eliminarPedido').addEventListener('click', function() {
        if (confirm('¿Estás seguro de eliminar este pedido?')) {
            pedidoLista.removeChild(fila);
            actualizarTotales();
            guardarPedidos();
        }
    });

    pedidoLista.appendChild(fila);

    actualizarTotales();
    guardarPedidos();
}

// Función para guardar los pedidos en el almacenamiento local
function guardarPedidos() {
    const pedidos = [];
    const filas = document.querySelectorAll('#pedidoLista tr');
    filas.forEach(fila => {
        const celdas = fila.children;
        const pedido = {
            fecha: celdas[0].textContent,
            personaje: celdas[1].textContent,
            cantidad: celdas[2].textContent,
            total: parseFloat(celdas[3].textContent.replace('$', '')),
            cliente: celdas[4].textContent,
            fechaEntrega: celdas[5].textContent,
            pagado: celdas[6].querySelector('input').checked
        };
        pedidos.push(pedido);
    });
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

// Función para cargar los pedidos desde el almacenamiento local
function cargarPedidos() {
    const pedidosGuardados = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidosGuardados.forEach(pedido => agregarPedido(pedido));
}

// Función para actualizar los totales
function actualizarTotales() {
    const filas = document.querySelectorAll('#pedidoLista tr');
    let totalGeneral = 0;
    let totalPagado = 0;

    filas.forEach(fila => {
        const total = parseFloat(fila.children[3].textContent.replace('$', ''));
        if (fila.classList.contains('pagado')) {
            totalPagado += total;
        } else {
            totalGeneral += total;
        }
    });

    document.getElementById('totalGeneral').textContent = `$${totalGeneral.toFixed(2)}`;
    document.getElementById('totalPagado').textContent = `$${totalPagado.toFixed(2)}`;
    document.getElementById('totalPendiente').textContent = `$${(totalGeneral - totalPagado).toFixed(2)}`;
}

// Función para eliminar todos los pedidos
document.getElementById('eliminarTodos').addEventListener('click', function() {
    if (confirm('¿Estás seguro de eliminar todos los pedidos?')) {
        document.getElementById('pedidoLista').innerHTML = '';
        actualizarTotales();
        guardarPedidos();
    }
});

