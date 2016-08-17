var myApp = angular.module('App', [
	'ngRoute',
	'controladores'
]);

myApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/main', {
		templateUrl: 'partials/inicio.html',
		controller: 'clientes'
	}).
	when('/clientes', {
		templateUrl: 'partials/clientes/clientes.html',
		controller: 'clientes'
	}).
    when('/clientes/nuevo', {
        templateUrl: 'partials/clientes/cliente.html',
        controller: 'cliente'
    }).
    when('/clientes/editar/:clienteId', {
        templateUrl: 'partials/clientes/cliente.html',
        controller: 'cliente'
    }).
    when('/productos', {
        templateUrl: 'partials/productos/productos.html',
        controller: 'productos'
    }).
    when('/productos/nuevo', {
        templateUrl: 'partials/productos/producto.html',
        controller: 'producto'
    }).
    when('/productos/editar/:productoId', {
        templateUrl: 'partials/productos/producto.html',
        controller: 'producto'
    }).
    when('/ventas', {
        templateUrl: 'partials/ventas/ventas.html',
        controller: 'ventas'
    }).
    when('/ventas/nuevo', {
        templateUrl: 'partials/ventas/venta.html',
        controller: 'venta'
    }).
    when('/ventas/ver/:ventaId', {
        templateUrl: 'partials/ventas/venta.html',
        controller: 'venta'
    }).
	otherwise({
		redirectTo: '/main'
	});
}]);