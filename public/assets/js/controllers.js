var controladores = angular.module('controladores',['ui.select', 'ui.mask', 'ngSanitize', 'ui.bootstrap']);

controladores.controller("cliente", ['$scope', '$http', '$modal', '$location', '$routeParams', function($scope, $http, $modal, $location, $routeParams){
    $scope.regimenes = [
        {
            id: 0,
            nombre: "Persona Física",
            mascara: "AAAA999999***"
        },
        {
            id: 1,
            nombre: "Persona Moral",
            mascara: "AAA999999***"
        }
    ];

    if ($routeParams.clienteId) {
        $http.get("index.php/clientes/getCliente/" + $routeParams.clienteId).success(function (cliente) {
            $scope.cliente = cliente;
            $scope.cliente.regimen = $scope.regimenes[$scope.cliente.regimen];
        });
    } else {
        $scope.cliente = {
            regimen: $scope.regimenes[0]
        };
    }

    $scope.mascara = function () {
        if (typeof $scope.cliente != "undefined") {
            return $scope.cliente.regimen.mascara;
        }
    }

    $scope.eliminar = function() {
        $http.get("index.php/clientes/eliminar/" + $scope.cliente.id).success(function (response) {
            if (response.success) {
                $location.path("clientes");
            }
        });
    }

    $scope.guardar = function (form) {
        if (form.$invalid) {
            $scope.b = true;
        } else {
            var modal = $modal.open({
                templateUrl: 'partials/guardando.html',
                controller: 'modalCrtl',
                size: 'sm',
                backdrop: 'static',
                resolve: {
                    obj: function () {
                        return {};
                    }
                }
            });
            $http({
                method: "POST",
                url: "index.php/clientes/saveCliente",
                data: $scope.cliente,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (response) {
                if (response.success) {
                    modal.close();
                    $location.path("clientes");
                }
            }).error(function () {
                modal.close();
            });
        }
    }
}]);

controladores.controller("clientes", ['$scope', '$http', function($scope, $http){
    $scope.clientes = [];

    $http.get("index.php/clientes").success(function (clientes) {
        $scope.clientes = clientes;
    });

}]);

controladores.controller("producto", ['$scope', '$http', '$modal', '$location', '$routeParams', function($scope, $http, $modal, $location, $routeParams){
    if ($routeParams.productoId) {
        $http.get("index.php/productos/getProducto/" + $routeParams.productoId).success(function (producto) {
            $scope.producto = producto;
            getIva();
        });
    } else {
        $scope.producto = {};
        getIva();
    }

    function getIva() {
        $http.get("index.php/productos/getIvas/").success(function (ivas) {
            $scope.ivas = ivas;
            if (!$scope.producto.edit) {
                $scope.producto.iva = $scope.ivas[0];
            }
        });
    }

    $scope.eliminar = function() {
        $http.get("index.php/productos/eliminar/" + $scope.producto.codigo).success(function (response) {
            if (response.success) {
                $location.path("productos");
            }
        });
    }

    $scope.guardar = function (invalid) {
        if (invalid) {
            b = true;
        } else {
            var modal = $modal.open({
                templateUrl: 'partials/guardando.html',
                controller: 'modalCrtl',
                size: 'sm',
                backdrop: 'static',
                resolve: {
                    obj: function () {
                        return {};
                    }
                }
            });
            $http({
                method: "POST",
                url: "index.php/productos/saveProducto",
                data: $scope.producto,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (response) {
                modal.close();
                if (response.success) {
                    $location.path("productos");
                } else {
                    $scope.error = response.error;
                }
            }).error(function () {
                modal.close();
            });
        }
    }
}]);

controladores.controller("productos", ['$scope', '$http', function($scope, $http){
    $scope.productos = [];

    $http.get("index.php/productos").success(function (productos) {
        $scope.productos = productos;
    });

}]);

controladores.controller("ventas", ['$scope', '$http', function($scope, $http){
    $scope.ventas = [];

    $http.get("index.php/ventas").success(function (ventas) {
        $scope.ventas = ventas;
    });

}]);

controladores.controller("venta", ['$scope', '$http', '$modal', '$location', '$routeParams', function($scope, $http, $modal, $location, $routeParams){
    if ($routeParams.ventaId) {
        $http.get("index.php/ventas/getVenta/" + $routeParams.ventaId).success(function (venta) {
            $scope.venta = venta;
            for (var i = 0; i < $scope.venta.rows.length; i++) {
                $scope.venta.rows[i].iepsUnidad = $scope.venta.rows[i].iepsUnidad == "1" ? true : false;
            }
            $scope.venta.deletedRows = [];
        });
    } else {
        $scope.venta = {
            rows: [{}],
            deletedRows: []
        };
    }

    $scope.importe = function (row) {
        if (typeof row.producto != "undefined" && typeof row.cantidad != "undefined") {
            var precio = parseFloat(row.producto.precio);
            var iva = parseFloat(row.producto.iva.tasa);
            return parseFloat(row.cantidad) * (precio + precio * iva / 100) + getIeps(row);
        }
        return 0;
    }

    $http.get("index.php/clientes").success(function (clientes) {
        $scope.clientes = clientes;
    });

    $http.get("index.php/productos").success(function (productos) {
        $scope.productos = productos;
    });

    $scope.eliminar = function() {
        $http.get("index.php/ventas/eliminar/" + $scope.venta.folio).success(function (response) {
            if (response.success) {
                $location.path("ventas");
            }
        });
    }

    $scope.guardar = function (invalid) {
        if (invalid) {
            $scope.b = true;
        } else {
            var modal = $modal.open({
                templateUrl: 'partials/guardando.html',
                controller: 'modalCrtl',
                size: 'sm',
                backdrop: 'static',
                resolve: {
                    obj: function () {
                        return {};
                    }
                }
            });
            $http({
                method: "POST",
                url: "index.php/ventas/saveVenta",
                data: $scope.venta,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (response) {
                modal.close();
                if (response.success) {
                    $location.path("ventas");
                } else {
                    $scope.error = response.error;
                }
            }).error(function () {
                modal.close();
            });
        }
    }

    function getIeps (row) {
        if (typeof row.producto != "undefined" && typeof row.cantidad != "undefined") {
            if (row.iepsUnidad == "1" || row.iepsUnidad === true) {
                return parseFloat(row.cantidad);
            }
            return parseFloat(row.cantidad) * parseFloat(row.producto.precio) * parseFloat(row.producto.ieps) / 100;
        }
        return 0;
    }

    $scope.subTotal = function (rows) {
        if (typeof rows == "undefined") {
            return 0;
        }
        var subTotal = 0;
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (typeof row.producto != "undefined") {
                subTotal += parseFloat(row.cantidad) * parseFloat(row.producto.precio);
            }
        }
        return subTotal ? subTotal : 0;
    }

    $scope.totalIVA = function (rows) {
        if (typeof rows == "undefined") {
            return 0;
        }
        var iva = 0;
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (typeof row.producto != "undefined") {
                iva += parseFloat(row.cantidad) * parseFloat(row.producto.precio) * parseFloat(row.producto.iva.tasa) / 100;
            }
        }
        return iva ? iva : 0;
    }

    $scope.totalIEPS = function (rows) {
        if (typeof rows == "undefined") {
            return 0;
        }
        var ieps = 0;
        for (var i = 0; i < rows.length; i++) {
            ieps += getIeps(rows[i]);
        }
        return ieps ? ieps : 0;
    }

    $scope.total = function (rows) {
        if (typeof rows == "undefined") {
            return 0;
        }
        var total = 0;
        for (var i = 0; i < rows.length; i++) {
            total += $scope.importe(rows[i]);
        }
        return total;
    }

    $scope.add = function() {
        $scope.venta.rows.push({});
    }

    $scope.remove = function (index) {
        if (typeof $scope.venta.rows[index].id != "undefined") {
            $scope.venta.deletedRows.push($scope.venta.rows[index].id);
        }
        $scope.venta.rows.splice(index,1);
    }
}]);

controladores.controller('modalCrtl', ['$scope', '$modalInstance', 'obj', function ($scope, $modalInstance, obj) {
    $scope.obj = obj;

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

function justNumbers(e) {
    var keynum = window.event ? window.event.keyCode : e.which;
    if ((keynum == 8) || (keynum == 46))
        return true;

    return /\d/.test(String.fromCharCode(keynum));
}
