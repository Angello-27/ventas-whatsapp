--
-- Estructura de tabla para la tabla `categoria`
--
CREATE TABLE `categoria` (
  `CategoriaId` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  `PadreCategoriaId` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `isActive` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`CategoriaId`),
  KEY `PadreCategoriaId` (`PadreCategoriaId`),
  CONSTRAINT `categoria_ibfk_1` FOREIGN KEY (`PadreCategoriaId`) REFERENCES `categoria` (`CategoriaId`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
--
-- Estructura de tabla para la tabla `clientes`
--
CREATE TABLE `clientes` (
  `ClienteId` int(11) NOT NULL AUTO_INCREMENT,
  `Telefono` varchar(100) NOT NULL,
  `Nombre` varchar(255) DEFAULT NULL,
  `Email` varchar(150) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`ClienteId`),
  UNIQUE KEY `Telefono` (`Telefono`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
--
-- Estructura de tabla para la tabla `clientesintereses`
--
CREATE TABLE `clientesintereses` (
  `InteresId` int(11) NOT NULL AUTO_INCREMENT,
  `ClienteId` int(11) NOT NULL,
  `Intereses` text NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`InteresId`),
  KEY `ClienteId` (`ClienteId`),
  CONSTRAINT `clientesintereses_ibfk_1` FOREIGN KEY (`ClienteId`) REFERENCES `clientes` (`ClienteId`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
--
-- Estructura de tabla para la tabla `marca`
--
CREATE TABLE `marca` (
  `MarcaId` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  `LogoUrl` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `isActive` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`MarcaId`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
--
-- Estructura de tabla para la tabla `mensajes`
--
CREATE TABLE `mensajes` (
  `MensajeId` int(11) NOT NULL AUTO_INCREMENT,
  `SesionId` int(11) NOT NULL,
  `Direccion` enum('Entrante', 'Saliente') NOT NULL,
  `Contenido` text NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `isActive` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`MensajeId`),
  KEY `SesionId` (`SesionId`),
  CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`SesionId`) REFERENCES `sesiones` (`SesionId`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
--
-- Estructura de tabla para la tabla `productoimagenes`
--
CREATE TABLE `productoimagenes` (
  `ImagenId` int(11) NOT NULL AUTO_INCREMENT,
  `ProductoId` int(11) NOT NULL,
  `VarianteId` int(11) NULL,
  `Url` varchar(255) NOT NULL,
  `EsPrincipal` tinyint(1) DEFAULT 0,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP(),
  `isActive` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`ImagenId`),
  KEY `ProductoId` (`ProductoId`),
  KEY `VarianteId` (`VarianteId`),
  CONSTRAINT `productoimagenes_ibfk_1` FOREIGN KEY (`ProductoId`) REFERENCES `productos` (`ProductoId`),
  CONSTRAINT `productoimagenes_ibfk_2` FOREIGN KEY (`VarianteId`) REFERENCES `productovariantes` (`VarianteId`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
--
-- Estructura de tabla para la tabla `productos`
--
CREATE TABLE `productos` (
  `ProductoId` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(255) NOT NULL,
  `Genero` enum('Hombre', 'Mujer', 'Niños', 'Unisex') NOT NULL,
  `MarcaId` int(11) NOT NULL,
  `CategoriaId` int(11) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `isActive` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`ProductoId`),
  KEY `MarcaId` (`MarcaId`),
  KEY `CategoriaId` (`CategoriaId`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`MarcaId`) REFERENCES `marca` (`MarcaId`),
  CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`CategoriaId`) REFERENCES `categoria` (`CategoriaId`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
--
-- Estructura de tabla para la tabla `productovariantes`
--
CREATE TABLE `productovariantes` (
  `VarianteId` int(11) NOT NULL AUTO_INCREMENT,
  `ProductoId` int(11) NOT NULL,
  `Color` varchar(50) NOT NULL,
  `Talla` varchar(10) NOT NULL,
  `Material` varchar(100) DEFAULT NULL,
  `SKU` varchar(100) NOT NULL,
  `PrecioVenta` decimal(10, 2) NOT NULL DEFAULT 0.00,
  `Cantidad` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime DEFAULT current_timestamp(),
  `isActive` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`VarianteId`),
  UNIQUE KEY `SKU` (`SKU`),
  KEY `ProductoId` (`ProductoId`),
  CONSTRAINT `productovariantes_ibfk_1` FOREIGN KEY (`ProductoId`) REFERENCES `productos` (`ProductoId`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
--
-- Estructura de tabla para la tabla `promociones`
--
CREATE TABLE `promociones` (
  `PromocionId` INT(11) NOT NULL AUTO_INCREMENT,
  `Titulo` VARCHAR(150) NOT NULL,
  `Descuento` DECIMAL(5, 2) NOT NULL,
  `FechaInicio` DATE NOT NULL,
  `FechaFin` DATE NOT NULL,
  `TipoPromo` ENUM('Categoria', 'Marca', 'Producto') NOT NULL,
  `TargetId` INT(11) NOT NULL,
  `Cobertura` DECIMAL(4, 2) NOT NULL DEFAULT 1.00,
  `Genero` ENUM('Hombre', 'Mujer', 'Niños', 'Unisex') NOT NULL DEFAULT 'Unisex',
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `isActive` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`PromocionId`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
--
-- Estructura de tabla para la tabla `promocionproductos`
--
CREATE TABLE `promocionproductos` (
  `PromocionProductoId` INT(11) NOT NULL AUTO_INCREMENT,
  `PromocionId` INT(11) NOT NULL,
  `ProductoId` INT(11) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `isActive` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`PromocionProductoId`),
  KEY `PromocionId` (`PromocionId`),
  KEY `ProductoId` (`ProductoId`),
  CONSTRAINT `promocionproductos_ibfk_1` FOREIGN KEY (`PromocionId`) REFERENCES `promociones` (`PromocionId`),
  CONSTRAINT `promocionproductos_ibfk_2` FOREIGN KEY (`ProductoId`) REFERENCES `productos` (`ProductoId`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
--
-- Estructura de tabla para la tabla `sesiones`
--
CREATE TABLE `sesiones` (
  `SesionId` int(11) NOT NULL AUTO_INCREMENT,
  `ClienteId` int(11) NOT NULL,
  `IniciadoEn` datetime DEFAULT current_timestamp(),
  `FinalizadoEn` datetime DEFAULT NULL,
  `UltimoContexto` JSON NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `IsActive` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`SesionId`),
  KEY `ClienteId` (`ClienteId`),
  CONSTRAINT `sesiones_ibfk_1` FOREIGN KEY (`ClienteId`) REFERENCES `clientes` (`ClienteId`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;