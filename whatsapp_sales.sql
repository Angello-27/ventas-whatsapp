-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-06-2025 a las 07:19:05
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `whatsapp_sales`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `CategoriaId` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `PadreCategoriaId` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `isActive` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`CategoriaId`, `Nombre`, `PadreCategoriaId`, `createdAt`, `isActive`) VALUES
(1, 'Ropa Superior', NULL, '2025-05-29 12:34:19', 1),
(2, 'Ropa Inferior', NULL, '2025-05-29 12:34:19', 1),
(3, 'Calzado', NULL, '2025-05-29 12:34:19', 1),
(4, 'Accesorios', NULL, '2025-05-29 12:34:19', 1),
(5, 'Abrigos', NULL, '2025-05-29 12:34:19', 1),
(6, 'Poleras', 1, '2025-05-29 12:34:19', 1),
(7, 'Camisas', 1, '2025-05-29 12:34:19', 1),
(8, 'Blusas', 1, '2025-05-29 12:34:19', 1),
(9, 'Vestidos', 1, '2025-05-29 12:34:19', 1),
(10, 'Pantalones', 2, '2025-05-29 12:34:19', 1),
(11, 'Shorts', 2, '2025-05-29 12:34:19', 1),
(12, 'Faldas', 2, '2025-05-29 12:34:19', 1),
(13, 'Zapatos', 3, '2025-05-29 12:34:19', 1),
(14, 'Sandalias', 3, '2025-05-29 12:34:19', 1),
(15, 'Botas', 3, '2025-05-29 12:34:19', 1),
(16, 'Gorras', 4, '2025-05-29 12:34:19', 1),
(17, 'Bufandas', 4, '2025-05-29 12:34:19', 1),
(18, 'Cinturones', 4, '2025-05-29 12:34:19', 1),
(19, 'Parkas', 5, '2025-05-29 12:34:19', 1),
(20, 'Chompas', 5, '2025-05-29 12:34:19', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `ClienteId` int(11) NOT NULL,
  `Telefono` varchar(100) NOT NULL,
  `Nombre` varchar(255) DEFAULT NULL,
  `Email` varchar(150) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientesintereses`
--

CREATE TABLE `clientesintereses` (
  `InteresId` int(11) NOT NULL,
  `ClienteId` int(11) NOT NULL,
  `Intereses` text NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marca`
--

CREATE TABLE `marca` (
  `MarcaId` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `LogoUrl` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `isActive` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `marca`
--

INSERT INTO `marca` (`MarcaId`, `Nombre`, `LogoUrl`, `createdAt`, `isActive`) VALUES
(1, 'Nike', 'https://logos.example.com/nike.png', '2025-05-29 12:33:21', 1),
(2, 'Adidas', 'https://logos.example.com/adidas.png', '2025-05-29 12:33:21', 1),
(3, 'Under Armour', 'https://logos.example.com/underarmour.png', '2025-05-29 12:33:21', 1),
(4, 'Puma', 'https://logos.example.com/puma.png', '2025-05-29 12:33:21', 1),
(5, 'Gap', 'https://logos.example.com/gap.png', '2025-05-29 12:33:21', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensajes`
--

CREATE TABLE `mensajes` (
  `MensajeId` int(11) NOT NULL,
  `SesionId` int(11) NOT NULL,
  `Direccion` enum('Entrante','Saliente') NOT NULL,
  `Contenido` text NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `isActive` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productoimagenes`
--

CREATE TABLE `productoimagenes` (
  `ImagenId` int(11) NOT NULL,
  `VarianteId` int(11) NOT NULL,
  `Url` varchar(255) NOT NULL,
  `EsPrincipal` tinyint(1) DEFAULT 0,
  `createdAt` datetime DEFAULT current_timestamp(),
  `isActive` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `ProductoId` int(11) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `Genero` enum('Hombre','Mujer','Niños','Unisex') NOT NULL,
  `MarcaId` int(11) NOT NULL,
  `CategoriaId` int(11) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `isActive` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`ProductoId`, `Nombre`, `Genero`, `MarcaId`, `CategoriaId`, `createdAt`, `isActive`) VALUES
(1, 'Polera de Hombre Adidas', 'Hombre', 2, 6, '2025-05-29 13:23:53', 1),
(2, 'Camisa de Hombre Adidas', 'Hombre', 2, 7, '2025-05-29 13:23:53', 1),
(3, 'Blusa Mujer Under Armour', 'Mujer', 3, 8, '2025-05-29 13:23:53', 1),
(4, 'Vestido de Niñas Puma', 'Niños', 4, 9, '2025-05-29 13:23:53', 1),
(5, 'Pantalón de Hombre Gap', 'Hombre', 5, 10, '2025-05-29 13:23:53', 1),
(6, 'Shorts de Mujer Under Armour', 'Mujer', 3, 11, '2025-05-29 13:23:53', 1),
(7, 'Falda de Niñas Puma', 'Niños', 4, 12, '2025-05-29 13:23:53', 1),
(8, 'Zapato de Niños Puma', 'Niños', 4, 13, '2025-05-29 13:23:53', 1),
(9, 'Sandalia de Hombre Nike', 'Hombre', 1, 14, '2025-05-29 13:23:53', 1),
(10, 'Bota de Mujer Adidas', 'Mujer', 2, 15, '2025-05-29 13:23:53', 1),
(11, 'Gorra Unisex Gap', 'Unisex', 5, 16, '2025-05-29 13:23:53', 1),
(12, 'Bufanda de Niños Adidas', 'Niños', 3, 17, '2025-05-29 13:23:53', 1),
(14, 'Parka de Mujer Puma', 'Mujer', 4, 19, '2025-05-29 13:23:53', 1),
(15, 'Chompa Hombre Gap', 'Hombre', 5, 20, '2025-05-29 13:23:53', 1),
(16, 'Polera de Niños Adidas', 'Niños', 2, 6, '2025-05-29 13:23:53', 1),
(17, 'Camisa de Hombre Puma', 'Hombre', 4, 7, '2025-05-29 13:23:53', 1),
(18, 'Blusa de Mujer Gap', 'Mujer', 5, 8, '2025-05-29 13:23:53', 1),
(21, 'Shorts de Hombre Nike', 'Hombre', 1, 11, '2025-05-29 13:23:53', 1),
(22, 'Falda de Niñas Adidas', 'Niños', 2, 12, '2025-05-29 13:23:53', 1),
(26, 'Gorra de Mujer Under Armour', 'Mujer', 3, 16, '2025-05-29 13:23:53', 1),
(27, 'Bufanda Unisex Puma', 'Unisex', 4, 17, '2025-05-29 13:23:53', 1),
(28, 'Cinturón de Niños Gap', 'Niños', 5, 18, '2025-05-29 13:23:53', 1),
(31, 'Polera Unisex Puma', 'Unisex', 4, 6, '2025-05-29 13:23:53', 1),
(32, 'Camisa de Niños Adidas', 'Niños', 2, 7, '2025-05-29 13:23:53', 1),
(34, 'Vestido de Mujer Puma', 'Mujer', 4, 9, '2025-05-29 13:23:53', 1),
(36, 'Shorts de Niños Under Armour', 'Niños', 3, 11, '2025-05-29 13:23:53', 1),
(37, 'Falda de Mujer Puma', 'Mujer', 4, 12, '2025-05-29 13:23:53', 1),
(38, 'Zapato de Mujer Gap', 'Mujer', 5, 13, '2025-05-29 13:23:53', 1),
(41, 'Gorra de Hombre Nike', 'Hombre', 1, 16, '2025-05-29 13:23:53', 1),
(42, 'Bufanda de Mujer Adidas', 'Mujer', 2, 17, '2025-05-29 13:23:53', 1),
(46, 'Polera de Mujer Under Armour', 'Mujer', 3, 6, '2025-05-29 13:23:53', 1),
(47, 'Camisa Unisex Puma', 'Unisex', 4, 7, '2025-05-29 13:23:53', 1),
(48, 'Blusa de Niñas Gap', 'Niños', 5, 8, '2025-05-29 13:23:53', 1),
(51, 'Shorts Unisex Nike', 'Unisex', 1, 11, '2025-05-29 13:23:53', 1),
(52, 'Falda de Niñas Nike', 'Niños', 1, 12, '2025-05-29 13:23:53', 1),
(56, 'Gorra de Niños Under Armour', 'Niños', 3, 16, '2025-05-29 13:23:53', 1),
(57, 'Bufanda de Hombre Puma', 'Hombre', 4, 17, '2025-05-29 13:23:53', 1),
(58, 'Cinturón de Mujer Gap', 'Mujer', 5, 18, '2025-05-29 13:23:53', 1),
(61, 'Polera de Hombre Nike', 'Hombre', 1, 6, '2025-05-29 13:23:53', 1),
(62, 'Camisa de Mujer Adidas', 'Mujer', 2, 7, '2025-05-29 13:23:53', 1),
(66, 'Shorts de Hombre Under Armour', 'Hombre', 3, 11, '2025-05-29 13:23:53', 1),
(67, 'Falda Mujer Adidas', 'Mujer', 2, 12, '2025-05-29 13:23:53', 1),
(68, 'Zapato de Niños Gap', 'Niños', 5, 13, '2025-05-29 13:23:53', 1),
(71, 'Gorra Unisex Nike', 'Unisex', 1, 16, '2025-05-29 13:23:53', 1),
(72, 'Bufanda de Niños Under Armour', 'Niños', 2, 17, '2025-05-29 13:23:53', 1),
(76, 'Polera de Niños Under Armour', 'Niños', 3, 6, '2025-05-29 13:23:53', 1),
(77, 'Camisa de Hombre Under Armour', 'Hombre', 3, 7, '2025-05-29 13:23:53', 1),
(78, 'Blusa de Mujer Puma', 'Mujer', 4, 8, '2025-05-29 13:23:53', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productovariantes`
--

CREATE TABLE `productovariantes` (
  `VarianteId` int(11) NOT NULL,
  `ProductoId` int(11) NOT NULL,
  `Color` varchar(50) NOT NULL,
  `Talla` varchar(10) NOT NULL,
  `Material` varchar(100) DEFAULT NULL,
  `SKU` varchar(100) NOT NULL,
  `PrecioVenta` decimal(10,2) NOT NULL DEFAULT 0.00,
  `Cantidad` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime DEFAULT current_timestamp(),
  `isActive` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productovariantes`
--

INSERT INTO `productovariantes` (`VarianteId`, `ProductoId`, `Color`, `Talla`, `Material`, `SKU`, `PrecioVenta`, `Cantidad`, `createdAt`, `isActive`) VALUES
(1, 1, 'Morado', 'S', 'Nylon', 'SKU-001', 50.65, 2, '2025-06-04 06:58:59', 1),
(2, 9, 'Negro', 'M', 'Mezclilla', 'SKU-009', 124.70, 16, '2025-06-04 06:58:59', 1),
(3, 11, 'Gris', 'S', 'Nylon', 'SKU-011', 72.21, 18, '2025-06-04 06:58:59', 1),
(4, 21, 'Rosa', 'XL', 'Poliéster', 'SKU-021', 56.35, 16, '2025-06-04 06:58:59', 1),
(5, 31, 'Rosa', 'XL', 'Mezclilla', 'SKU-031', 117.12, 8, '2025-06-04 06:58:59', 1),
(6, 41, 'Marrón', 'M', 'Nylon', 'SKU-041', 108.01, 18, '2025-06-04 06:58:59', 1),
(7, 51, 'Rosa', 'XL', 'Lino', 'SKU-051', 109.38, 1, '2025-06-04 06:58:59', 1),
(8, 61, 'Negro', 'XL', 'Seda', 'SKU-061', 131.42, 19, '2025-06-04 06:58:59', 1),
(9, 71, 'Verde', 'L', 'Algodón', 'SKU-071', 123.51, 8, '2025-06-04 06:58:59', 1),
(10, 2, 'Rosa', 'S', 'Lana', 'SKU-002', 85.44, 5, '2025-06-04 06:58:59', 1),
(11, 10, 'Morado', 'S', 'Nylon', 'SKU-010', 58.26, 8, '2025-06-04 06:58:59', 1),
(12, 12, 'Rosa', 'M', 'Algodón', 'SKU-012', 128.30, 13, '2025-06-04 06:58:59', 1),
(13, 22, 'Marrón', 'L', 'Seda', 'SKU-022', 139.57, 5, '2025-06-04 06:58:59', 1),
(14, 32, 'Negro', 'M', 'Algodón', 'SKU-032', 133.39, 17, '2025-06-04 06:58:59', 1),
(15, 42, 'Amarillo', 'L', 'Cuero', 'SKU-042', 80.09, 5, '2025-06-04 06:58:59', 1),
(16, 52, 'Azul', 'S', 'Mezclilla', 'SKU-052', 70.98, 9, '2025-06-04 06:58:59', 1),
(17, 62, 'Blanco', 'S', 'Poliéster', 'SKU-062', 84.56, 7, '2025-06-04 06:58:59', 1),
(18, 72, 'Amarillo', 'XXL', 'Seda', 'SKU-072', 132.80, 16, '2025-06-04 06:58:59', 1),
(19, 3, 'Verde', 'M', 'Poliéster', 'SKU-003', 78.63, 18, '2025-06-04 06:58:59', 1),
(20, 6, 'Amarillo', 'XXL', 'Mezclilla', 'SKU-006', 53.26, 7, '2025-06-04 06:58:59', 1),
(21, 16, 'Rosa', 'S', 'Lana', 'SKU-016', 103.52, 1, '2025-06-04 06:58:59', 1),
(22, 26, 'Negro', 'XXL', 'Nylon', 'SKU-026', 102.02, 11, '2025-06-04 06:58:59', 1),
(23, 36, 'Azul', 'XXL', 'Seda', 'SKU-036', 78.78, 4, '2025-06-04 06:58:59', 1),
(24, 46, 'Marrón', 'S', 'Seda', 'SKU-046', 53.68, 19, '2025-06-04 06:58:59', 1),
(25, 56, 'Amarillo', 'XL', 'Lino', 'SKU-056', 78.28, 10, '2025-06-04 06:58:59', 1),
(26, 66, 'Blanco', 'XXL', 'Poliéster', 'SKU-066', 77.11, 15, '2025-06-04 06:58:59', 1),
(27, 76, 'Marrón', 'M', 'Lana', 'SKU-076', 63.47, 19, '2025-06-04 06:58:59', 1),
(28, 4, 'Verde', 'L', 'Algodón', 'SKU-004', 126.96, 11, '2025-06-04 06:58:59', 1),
(29, 7, 'Negro', 'S', 'Algodón', 'SKU-007', 91.45, 17, '2025-06-04 06:58:59', 1),
(30, 14, 'Marrón', 'XL', 'Nylon', 'SKU-014', 86.34, 18, '2025-06-04 06:58:59', 1),
(31, 17, 'Negro', 'M', 'Algodón', 'SKU-017', 86.34, 16, '2025-06-04 06:58:59', 1),
(32, 27, 'Marrón', 'XL', 'Poliéster', 'SKU-027', 121.87, 2, '2025-06-04 06:58:59', 1),
(33, 34, 'Azul', 'L', 'Lino', 'SKU-034', 131.06, 4, '2025-06-04 06:58:59', 1),
(34, 37, 'Blanco', 'XXL', 'Poliéster', 'SKU-037', 55.47, 16, '2025-06-04 06:58:59', 1),
(35, 47, 'Rosa', 'XXL', 'Nylon', 'SKU-047', 121.69, 10, '2025-06-04 06:58:59', 1),
(36, 57, 'Verde', 'S', 'Poliéster', 'SKU-057', 58.05, 15, '2025-06-04 06:58:59', 1),
(37, 67, 'Verde', 'M', 'Mezclilla', 'SKU-067', 102.09, 17, '2025-06-04 06:58:59', 1),
(38, 77, 'Rosa', 'XL', 'Lino', 'SKU-077', 124.42, 15, '2025-06-04 06:58:59', 1),
(39, 5, 'Negro', 'L', 'Lino', 'SKU-005', 64.98, 18, '2025-06-04 06:58:59', 1),
(40, 8, 'Marrón', 'L', 'Mezclilla', 'SKU-008', 67.38, 3, '2025-06-04 06:58:59', 1),
(41, 15, 'Azul', 'M', 'Nylon', 'SKU-015', 147.82, 15, '2025-06-04 06:58:59', 1),
(42, 18, 'Rosa', 'XXL', 'Algodón', 'SKU-018', 108.70, 12, '2025-06-04 06:58:59', 1),
(43, 28, 'Azul', 'S', 'Nylon', 'SKU-028', 65.16, 17, '2025-06-04 06:58:59', 1),
(44, 38, 'Rosa', 'XXL', 'Cuero', 'SKU-038', 51.24, 15, '2025-06-04 06:58:59', 1),
(45, 48, 'Blanco', 'M', 'Algodón', 'SKU-048', 97.89, 4, '2025-06-04 06:58:59', 1),
(46, 58, 'Negro', 'M', 'Poliéster', 'SKU-058', 83.55, 1, '2025-06-04 06:58:59', 1),
(47, 68, 'Azul', 'L', 'Seda', 'SKU-068', 103.82, 7, '2025-06-04 06:58:59', 1),
(48, 78, 'Azul', 'L', 'Seda', 'SKU-078', 85.38, 12, '2025-06-04 06:58:59', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `promociones`
--

CREATE TABLE `promociones` (
  `PromocionId` int(11) NOT NULL,
  `Titulo` varchar(255) NOT NULL,
  `DescuentoPct` decimal(5,2) NOT NULL,
  `FechaInicio` date NOT NULL,
  `FechaFin` date NOT NULL,
  `TipoPromo` ENUM('Categoria','Marca','Producto') NOT NULL,
  `TargetId`  INT(11) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `isActive` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `promociones`
--

INSERT INTO `promociones` (`PromocionId`, `Titulo`, `DescuentoPct`, `FechaInicio`, `FechaFin`, `createdAt`, `isActive`) VALUES
(1, 'Verano Camisas -20%', 20.00, '2025-06-01', '2025-06-30', '2025-06-04 07:22:01', 1),
(2, 'Rebaja Jeans -15%', 15.00, '2025-06-10', '2025-06-20', '2025-06-04 07:22:01', 1),
(3, 'Oferta Chaquetas 10%', 10.00, '2025-06-05', '2025-06-25', '2025-06-04 07:22:01', 1),
(4, 'Descuento Nike -10%', 10.00, '2025-06-01', '2025-06-10', '2025-06-04 07:11:42', 1),
(5, 'Oferta Adidas -25%', 25.00, '2025-06-05', '2025-06-15', '2025-06-04 07:11:42', 1),
(6, 'Promo Under Armour -30%', 30.00, '2025-06-10', '2025-06-20', '2025-06-04 07:11:42', 1),
(7, 'Liquidación Puma -20%', 20.00, '2025-06-12', '2025-06-22', '2025-06-04 07:11:42', 1),
(8, 'Rebaja Gap -15%', 15.00, '2025-06-15', '2025-06-25', '2025-06-04 07:11:42', 1),
(9, 'Descuento Nike Verano -5%', 5.00, '2025-06-20', '2025-06-30', '2025-06-04 07:11:42', 1),
(10, 'Oferta Adidas Camisetas -10%', 10.00, '2025-06-22', '2025-07-02', '2025-06-04 07:11:42', 1),
(11, 'Promo Under Armour Shorts -20%', 20.00, '2025-06-25', '2025-07-05', '2025-06-04 07:11:42', 1),
(12, 'Liquidación Puma Faldas -25%', 25.00, '2025-06-28', '2025-07-08', '2025-06-04 07:11:42', 1),
(13, 'Rebaja Gap Zapatos -30%', 30.00, '2025-07-01', '2025-07-11', '2025-06-04 07:11:42', 1),
(14, 'Descuento Nike Gorros -15%', 15.00, '2025-07-05', '2025-07-15', '2025-06-04 07:11:42', 1),
(15, 'Oferta Adidas Bufandas -20%', 20.00, '2025-07-08', '2025-07-18', '2025-06-04 07:11:42', 1),
(16, 'Promo Under Armour Poleras -10%', 10.00, '2025-07-10', '2025-07-20', '2025-06-04 07:11:42', 1),
(17, 'Liquidación Puma Camisas -15%', 15.00, '2025-07-12', '2025-07-22', '2025-06-04 07:11:42', 1),
(18, 'Rebaja Gap Chaquetas -20%', 20.00, '2025-07-15', '2025-07-25', '2025-06-04 07:11:42', 1),
(19, 'Descuento Nike Pantalones -25%', 25.00, '2025-07-18', '2025-07-28', '2025-06-04 07:11:42', 1),
(20, 'Oferta Adidas Shorts -30%', 30.00, '2025-07-20', '2025-07-30', '2025-06-04 07:11:42', 1),
(21, 'Promo Under Armour Faldas -10%', 10.00, '2025-07-22', '2025-08-01', '2025-06-04 07:11:42', 1),
(22, 'Liquidación Puma Zapatos -15%', 15.00, '2025-07-25', '2025-08-04', '2025-06-04 07:11:42', 1),
(23, 'Rebaja Gap Botas -20%', 20.00, '2025-07-28', '2025-08-07', '2025-06-04 07:11:42', 1),
(24, 'Descuento Nike Gorra Unisex -10%', 10.00, '2025-08-01', '2025-08-11', '2025-06-04 07:11:42', 1),
(25, 'Oferta Adidas Bufanda Niños -15%', 15.00, '2025-08-03', '2025-08-13', '2025-06-04 07:11:42', 1),
(26, 'Promo Under Armour Polera Niños -20%', 20.00, '2025-08-05', '2025-08-15', '2025-06-04 07:11:42', 1),
(27, 'Liquidación Puma Camisa Hombre -25%', 25.00, '2025-08-07', '2025-08-17', '2025-06-04 07:11:42', 1),
(28, 'Rebaja Gap Zapato Mujer -30%', 30.00, '2025-08-10', '2025-08-20', '2025-06-04 07:11:42', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `promocion_variantes`
--

CREATE TABLE `promocion_variantes` (
  `PromocionVarianteId` int(11) NOT NULL,
  `PromocionId` int(11) NOT NULL,
  `VarianteId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `isActive` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `promocion_variantes`
--

INSERT INTO `promocion_variantes` (`PromocionVarianteId`, `PromocionId`, `VarianteId`, `createdAt`, `isActive`) VALUES
(49, 1, 1, '2025-06-05 01:15:32', 1),
(50, 1, 2, '2025-06-05 01:15:32', 1),
(51, 2, 3, '2025-06-05 01:15:32', 1),
(52, 2, 4, '2025-06-05 01:15:32', 1),
(53, 3, 5, '2025-06-05 01:15:32', 1),
(54, 3, 6, '2025-06-05 01:15:32', 1),
(55, 4, 7, '2025-06-05 01:15:32', 1),
(56, 4, 8, '2025-06-05 01:15:32', 1),
(57, 5, 9, '2025-06-05 01:15:32', 1),
(58, 5, 10, '2025-06-05 01:15:32', 1),
(59, 6, 11, '2025-06-05 01:15:32', 1),
(60, 6, 12, '2025-06-05 01:15:32', 1),
(61, 7, 13, '2025-06-05 01:15:32', 1),
(62, 7, 14, '2025-06-05 01:15:32', 1),
(63, 8, 15, '2025-06-05 01:15:32', 1),
(64, 8, 16, '2025-06-05 01:15:32', 1),
(65, 9, 17, '2025-06-05 01:15:32', 1),
(66, 9, 18, '2025-06-05 01:15:32', 1),
(67, 10, 19, '2025-06-05 01:15:32', 1),
(68, 10, 20, '2025-06-05 01:15:32', 1),
(69, 11, 21, '2025-06-05 01:15:32', 1),
(70, 11, 22, '2025-06-05 01:15:32', 1),
(71, 12, 23, '2025-06-05 01:15:32', 1),
(72, 12, 24, '2025-06-05 01:15:32', 1),
(73, 13, 25, '2025-06-05 01:15:32', 1),
(74, 13, 26, '2025-06-05 01:15:32', 1),
(75, 14, 27, '2025-06-05 01:15:32', 1),
(76, 14, 28, '2025-06-05 01:15:32', 1),
(77, 15, 29, '2025-06-05 01:15:32', 1),
(78, 15, 30, '2025-06-05 01:15:32', 1),
(79, 16, 31, '2025-06-05 01:15:32', 1),
(80, 16, 32, '2025-06-05 01:15:32', 1),
(81, 17, 33, '2025-06-05 01:15:32', 1),
(82, 17, 34, '2025-06-05 01:15:32', 1),
(83, 18, 35, '2025-06-05 01:15:32', 1),
(84, 18, 36, '2025-06-05 01:15:32', 1),
(85, 19, 37, '2025-06-05 01:15:32', 1),
(86, 19, 38, '2025-06-05 01:15:32', 1),
(87, 20, 39, '2025-06-05 01:15:32', 1),
(88, 20, 40, '2025-06-05 01:15:32', 1),
(89, 21, 41, '2025-06-05 01:15:32', 1),
(90, 21, 42, '2025-06-05 01:15:32', 1),
(91, 22, 43, '2025-06-05 01:15:32', 1),
(92, 22, 44, '2025-06-05 01:15:32', 1),
(93, 23, 45, '2025-06-05 01:15:32', 1),
(94, 23, 46, '2025-06-05 01:15:32', 1),
(95, 24, 47, '2025-06-05 01:15:32', 1),
(96, 24, 48, '2025-06-05 01:15:32', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sesiones`
--

CREATE TABLE `sesiones` (
  `SesionId` int(11) NOT NULL,
  `ClienteId` int(11) NOT NULL,
  `IniciadoEn` datetime DEFAULT current_timestamp(),
  `FinalizadoEn` datetime DEFAULT NULL,
  `UltimoContexto` JSON NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `IsActive` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`CategoriaId`),
  ADD KEY `PadreCategoriaId` (`PadreCategoriaId`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`ClienteId`),
  ADD UNIQUE KEY `Telefono` (`Telefono`);

--
-- Indices de la tabla `clientesintereses`
--
ALTER TABLE `clientesintereses`
  ADD PRIMARY KEY (`InteresId`),
  ADD KEY `ClienteId` (`ClienteId`);

--
-- Indices de la tabla `marca`
--
ALTER TABLE `marca`
  ADD PRIMARY KEY (`MarcaId`);

--
-- Indices de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD PRIMARY KEY (`MensajeId`),
  ADD KEY `SesionId` (`SesionId`);

--
-- Indices de la tabla `productoimagenes`
--
ALTER TABLE `productoimagenes`
  ADD PRIMARY KEY (`ImagenId`),
  ADD KEY `VarianteId` (`VarianteId`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`ProductoId`),
  ADD KEY `MarcaId` (`MarcaId`),
  ADD KEY `CategoriaId` (`CategoriaId`);

--
-- Indices de la tabla `productovariantes`
--
ALTER TABLE `productovariantes`
  ADD PRIMARY KEY (`VarianteId`),
  ADD UNIQUE KEY `SKU` (`SKU`),
  ADD KEY `ProductoId` (`ProductoId`);

--
-- Indices de la tabla `promociones`
--
ALTER TABLE `promociones`
  ADD PRIMARY KEY (`PromocionId`);

--
-- Indices de la tabla `promocion_variantes`
--
ALTER TABLE `promocion_variantes`
  ADD PRIMARY KEY (`PromocionVarianteId`),
  ADD KEY `PromocionId` (`PromocionId`),
  ADD KEY `VarianteId` (`VarianteId`);

--
-- Indices de la tabla `sesiones`
--
ALTER TABLE `sesiones`
  ADD PRIMARY KEY (`SesionId`),
  ADD KEY `ClienteId` (`ClienteId`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `CategoriaId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `ClienteId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `clientesintereses`
--
ALTER TABLE `clientesintereses`
  MODIFY `InteresId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `marca`
--
ALTER TABLE `marca`
  MODIFY `MarcaId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  MODIFY `MensajeId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productoimagenes`
--
ALTER TABLE `productoimagenes`
  MODIFY `ImagenId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `ProductoId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT de la tabla `productovariantes`
--
ALTER TABLE `productovariantes`
  MODIFY `VarianteId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT de la tabla `promociones`
--
ALTER TABLE `promociones`
  MODIFY `PromocionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `promocion_variantes`
--
ALTER TABLE `promocion_variantes`
  MODIFY `PromocionVarianteId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT de la tabla `sesiones`
--
ALTER TABLE `sesiones`
  MODIFY `SesionId` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD CONSTRAINT `categoria_ibfk_1` FOREIGN KEY (`PadreCategoriaId`) REFERENCES `categoria` (`CategoriaId`);

--
-- Filtros para la tabla `clientesintereses`
--
ALTER TABLE `clientesintereses`
  ADD CONSTRAINT `clientesintereses_ibfk_1` FOREIGN KEY (`ClienteId`) REFERENCES `clientes` (`ClienteId`);

--
-- Filtros para la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`SesionId`) REFERENCES `sesiones` (`SesionId`);

--
-- Filtros para la tabla `productoimagenes`
--
ALTER TABLE `productoimagenes`
  ADD CONSTRAINT `productoimagenes_ibfk_1` FOREIGN KEY (`VarianteId`) REFERENCES `productovariantes` (`VarianteId`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`MarcaId`) REFERENCES `marca` (`MarcaId`),
  ADD CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`CategoriaId`) REFERENCES `categoria` (`CategoriaId`);

--
-- Filtros para la tabla `productovariantes`
--
ALTER TABLE `productovariantes`
  ADD CONSTRAINT `productovariantes_ibfk_1` FOREIGN KEY (`ProductoId`) REFERENCES `productos` (`ProductoId`);

--
-- Filtros para la tabla `promocion_variantes`
--
ALTER TABLE `promocion_variantes`
  ADD CONSTRAINT `promocion_variantes_ibfk_1` FOREIGN KEY (`PromocionId`) REFERENCES `promociones` (`PromocionId`),
  ADD CONSTRAINT `promocion_variantes_ibfk_2` FOREIGN KEY (`VarianteId`) REFERENCES `productovariantes` (`VarianteId`);

--
-- Filtros para la tabla `sesiones`
--
ALTER TABLE `sesiones`
  ADD CONSTRAINT `sesiones_ibfk_1` FOREIGN KEY (`ClienteId`) REFERENCES `clientes` (`ClienteId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
