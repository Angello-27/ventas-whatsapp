-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-05-2025 a las 19:05:16
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
-- Base de datos: `ventas_whatsappia`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `almacen`
--

CREATE TABLE `almacen` (
  `AlmacenId` int(11) NOT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  `Direccion` varchar(200) DEFAULT NULL,
  `SucursalId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `almacen`
--

INSERT INTO `almacen` (`AlmacenId`, `Nombre`, `Direccion`, `SucursalId`, `createdAt`, `updatedAt`, `isActive`) VALUES
(1, 'Almacén Virtual', 'Ubicación Digital', 1, '2025-05-22 11:39:17', '2025-05-22 11:39:17', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `campana`
--

CREATE TABLE `campana` (
  `CampanaId` int(11) NOT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  `Descripción` varchar(250) DEFAULT NULL,
  `Tipo` enum('Descuento','Promoción','Oferta','Combo','Paquete') DEFAULT NULL,
  `FechaInicio` datetime DEFAULT NULL,
  `FechaFin` datetime DEFAULT NULL,
  `Parámetros` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Parámetros`)),
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `campana`
--

INSERT INTO `campana` (`CampanaId`, `Nombre`, `Descripción`, `Tipo`, `FechaInicio`, `FechaFin`, `Parámetros`, `createdAt`, `updatedAt`, `isActive`) VALUES
(1, 'Verano Kids 15%', '15% de descuento en ropa de niños', 'Descuento', '2025-06-01 00:00:00', '2025-06-30 00:00:00', '{\"DescuentoPorcentaje\": 15}', '2025-05-22 11:54:34', '2025-05-22 11:54:34', 1),
(2, 'Combo Hombre 3x2', 'Lleva 3 paga 2 en ropa de hombre', 'Promoción', '2025-05-01 00:00:00', '2025-05-31 00:00:00', '{\"Buy\": 3, \"Pay\": 2}', '2025-05-22 11:54:34', '2025-05-22 11:54:34', 1),
(3, 'Pack Formal 2×75', '2 chaquetas formales por 75 Bs', 'Promoción', '2025-07-01 00:00:00', '2025-07-31 00:00:00', '{\"BundleQty\": 2, \"BundlePrice\": 75}', '2025-05-22 11:54:34', '2025-05-22 11:54:34', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `campanaambito`
--

CREATE TABLE `campanaambito` (
  `AlcanceId` int(11) NOT NULL,
  `CampanaId` int(11) DEFAULT NULL,
  `TipoAmbito` enum('Producto','Categoría','ClienteTipo') DEFAULT NULL,
  `ObjetoId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `campanaambito`
--

INSERT INTO `campanaambito` (`AlcanceId`, `CampanaId`, `TipoAmbito`, `ObjetoId`, `createdAt`, `updatedAt`, `isActive`) VALUES
(1, 1, 'Categoría', 3, '2025-05-22 11:54:34', '2025-05-22 11:54:34', 1),
(2, 2, 'Categoría', 1, '2025-05-22 11:54:34', '2025-05-22 11:54:34', 1),
(3, 3, 'Producto', 5, '2025-05-22 11:54:34', '2025-05-22 11:54:34', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `campanaitem`
--

CREATE TABLE `campanaitem` (
  `ItemId` int(11) NOT NULL,
  `CampanaId` int(11) DEFAULT NULL,
  `EnvaseId` int(11) DEFAULT NULL,
  `Cantidad` int(11) DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `campanaitem`
--

INSERT INTO `campanaitem` (`ItemId`, `CampanaId`, `EnvaseId`, `Cantidad`, `createdAt`, `updatedAt`, `isActive`) VALUES
(1, 3, 9, 1, '2025-05-22 11:54:34', '2025-05-22 11:54:34', 1),
(2, 3, 10, 1, '2025-05-22 11:54:34', '2025-05-22 11:54:34', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `CategoriaId` int(11) NOT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  `PadreCategoriaId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`CategoriaId`, `Nombre`, `PadreCategoriaId`, `createdAt`, `updatedAt`, `isActive`) VALUES
(1, 'Hombre', NULL, '2025-05-22 11:39:17', '2025-05-22 11:39:17', 1),
(2, 'Mujer', NULL, '2025-05-22 11:39:17', '2025-05-22 11:39:17', 1),
(3, 'Niños', NULL, '2025-05-22 11:39:17', '2025-05-22 11:39:17', 1),
(4, 'Camisetas', 1, '2025-05-22 11:39:17', '2025-05-22 11:39:17', 1),
(5, 'Pantalones', 1, '2025-05-22 11:39:17', '2025-05-22 11:39:17', 1),
(6, 'Camisetas', 2, '2025-05-22 11:39:17', '2025-05-22 11:39:17', 1),
(7, 'Pantalones', 2, '2025-05-22 11:39:17', '2025-05-22 11:39:17', 1),
(8, 'Camisetas', 3, '2025-05-22 11:39:17', '2025-05-22 11:39:17', 1),
(9, 'Pantalones', 3, '2025-05-22 11:39:17', '2025-05-22 11:39:17', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `ClienteId` int(11) NOT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  `Sexo` enum('Masculino','Femenino','Otro') DEFAULT NULL,
  `Telefono` varchar(100) DEFAULT NULL,
  `Email` varchar(200) DEFAULT NULL,
  `Direccion` varchar(200) DEFAULT NULL,
  `TipoCliente` enum('Nuevo','Registrado','Empresa') DEFAULT 'Nuevo',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuentafidelidad`
--

CREATE TABLE `cuentafidelidad` (
  `CuentaId` int(11) NOT NULL,
  `ClienteId` int(11) DEFAULT NULL,
  `PuntosBalance` int(11) DEFAULT 0,
  `Nivel` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `envaseproducto`
--

CREATE TABLE `envaseproducto` (
  `EnvaseId` int(11) NOT NULL,
  `SKU` varchar(50) DEFAULT NULL,
  `Descripcion` varchar(100) DEFAULT NULL,
  `ProductoId` int(11) DEFAULT NULL,
  `Atributos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Atributos`)),
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `envaseproducto`
--

INSERT INTO `envaseproducto` (`EnvaseId`, `SKU`, `Descripcion`, `ProductoId`, `Atributos`, `createdAt`, `updatedAt`, `isActive`) VALUES
(1, 'Camiseta Deportiva Hombre-S-Rojo', 'Camiseta Deportiva Hombre S Rojo', 1, '{\"Talla\": \"S\", \"Color\": \"Rojo\", \"Material\": \"Poliéster\", \"Uso\": \"Deportivo\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(2, 'Camiseta Deportiva Hombre-S-Azul', 'Camiseta Deportiva Hombre S Azul', 1, '{\"Talla\": \"S\", \"Color\": \"Azul\", \"Material\": \"Poliéster\", \"Uso\": \"Deportivo\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(3, 'Pantalón Casual Mujer-S-Rojo', 'Pantalón Casual Mujer S Rojo', 2, '{\"Talla\": \"S\", \"Color\": \"Rojo\", \"Material\": \"Algodón\", \"Uso\": \"Casual\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(4, 'Pantalón Casual Mujer-S-Azul', 'Pantalón Casual Mujer S Azul', 2, '{\"Talla\": \"S\", \"Color\": \"Azul\", \"Material\": \"Algodón\", \"Uso\": \"Casual\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(5, 'Camiseta Verano Niño-S-Rojo', 'Camiseta Verano Niño S Rojo', 3, '{\"Talla\": \"S\", \"Color\": \"Rojo\", \"Material\": \"Algodón\", \"Uso\": \"Casual\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(6, 'Camiseta Verano Niño-S-Azul', 'Camiseta Verano Niño S Azul', 3, '{\"Talla\": \"S\", \"Color\": \"Azul\", \"Material\": \"Algodón\", \"Uso\": \"Casual\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(7, 'Short Deportivo Hombre-S-Rojo', 'Short Deportivo Hombre S Rojo', 4, '{\"Talla\": \"S\", \"Color\": \"Rojo\", \"Material\": \"Poliéster\", \"Uso\": \"Deportivo\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(8, 'Short Deportivo Hombre-S-Azul', 'Short Deportivo Hombre S Azul', 4, '{\"Talla\": \"S\", \"Color\": \"Azul\", \"Material\": \"Poliéster\", \"Uso\": \"Deportivo\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(9, 'Chaqueta Formal Mujer-S-Rojo', 'Chaqueta Formal Mujer S Rojo', 5, '{\"Talla\": \"S\", \"Color\": \"Rojo\", \"Material\": \"Lino\", \"Uso\": \"Formal\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(10, 'Chaqueta Formal Mujer-S-Azul', 'Chaqueta Formal Mujer S Azul', 5, '{\"Talla\": \"S\", \"Color\": \"Azul\", \"Material\": \"Lino\", \"Uso\": \"Formal\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(11, 'Camiseta Deportiva Hombre-M-Rojo', 'Camiseta Deportiva Hombre M Rojo', 1, '{\"Talla\": \"M\", \"Color\": \"Rojo\", \"Material\": \"Poliéster\", \"Uso\": \"Deportivo\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(12, 'Camiseta Deportiva Hombre-M-Azul', 'Camiseta Deportiva Hombre M Azul', 1, '{\"Talla\": \"M\", \"Color\": \"Azul\", \"Material\": \"Poliéster\", \"Uso\": \"Deportivo\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(13, 'Pantalón Casual Mujer-M-Rojo', 'Pantalón Casual Mujer M Rojo', 2, '{\"Talla\": \"M\", \"Color\": \"Rojo\", \"Material\": \"Algodón\", \"Uso\": \"Casual\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(14, 'Pantalón Casual Mujer-M-Azul', 'Pantalón Casual Mujer M Azul', 2, '{\"Talla\": \"M\", \"Color\": \"Azul\", \"Material\": \"Algodón\", \"Uso\": \"Casual\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(15, 'Camiseta Verano Niño-M-Rojo', 'Camiseta Verano Niño M Rojo', 3, '{\"Talla\": \"M\", \"Color\": \"Rojo\", \"Material\": \"Algodón\", \"Uso\": \"Casual\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(16, 'Camiseta Verano Niño-M-Azul', 'Camiseta Verano Niño M Azul', 3, '{\"Talla\": \"M\", \"Color\": \"Azul\", \"Material\": \"Algodón\", \"Uso\": \"Casual\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(17, 'Short Deportivo Hombre-M-Rojo', 'Short Deportivo Hombre M Rojo', 4, '{\"Talla\": \"M\", \"Color\": \"Rojo\", \"Material\": \"Poliéster\", \"Uso\": \"Deportivo\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(18, 'Short Deportivo Hombre-M-Azul', 'Short Deportivo Hombre M Azul', 4, '{\"Talla\": \"M\", \"Color\": \"Azul\", \"Material\": \"Poliéster\", \"Uso\": \"Deportivo\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(19, 'Chaqueta Formal Mujer-M-Rojo', 'Chaqueta Formal Mujer M Rojo', 5, '{\"Talla\": \"M\", \"Color\": \"Rojo\", \"Material\": \"Lino\", \"Uso\": \"Formal\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(20, 'Chaqueta Formal Mujer-M-Azul', 'Chaqueta Formal Mujer M Azul', 5, '{\"Talla\": \"M\", \"Color\": \"Azul\", \"Material\": \"Lino\", \"Uso\": \"Formal\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(21, 'Camiseta Deportiva Hombre-L-Rojo', 'Camiseta Deportiva Hombre L Rojo', 1, '{\"Talla\": \"L\", \"Color\": \"Rojo\", \"Material\": \"Poliéster\", \"Uso\": \"Deportivo\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(22, 'Camiseta Deportiva Hombre-L-Azul', 'Camiseta Deportiva Hombre L Azul', 1, '{\"Talla\": \"L\", \"Color\": \"Azul\", \"Material\": \"Poliéster\", \"Uso\": \"Deportivo\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(23, 'Pantalón Casual Mujer-L-Rojo', 'Pantalón Casual Mujer L Rojo', 2, '{\"Talla\": \"L\", \"Color\": \"Rojo\", \"Material\": \"Algodón\", \"Uso\": \"Casual\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(24, 'Pantalón Casual Mujer-L-Azul', 'Pantalón Casual Mujer L Azul', 2, '{\"Talla\": \"L\", \"Color\": \"Azul\", \"Material\": \"Algodón\", \"Uso\": \"Casual\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(25, 'Camiseta Verano Niño-L-Rojo', 'Camiseta Verano Niño L Rojo', 3, '{\"Talla\": \"L\", \"Color\": \"Rojo\", \"Material\": \"Algodón\", \"Uso\": \"Casual\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(26, 'Camiseta Verano Niño-L-Azul', 'Camiseta Verano Niño L Azul', 3, '{\"Talla\": \"L\", \"Color\": \"Azul\", \"Material\": \"Algodón\", \"Uso\": \"Casual\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(27, 'Short Deportivo Hombre-L-Rojo', 'Short Deportivo Hombre L Rojo', 4, '{\"Talla\": \"L\", \"Color\": \"Rojo\", \"Material\": \"Poliéster\", \"Uso\": \"Deportivo\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(28, 'Short Deportivo Hombre-L-Azul', 'Short Deportivo Hombre L Azul', 4, '{\"Talla\": \"L\", \"Color\": \"Azul\", \"Material\": \"Poliéster\", \"Uso\": \"Deportivo\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(29, 'Chaqueta Formal Mujer-L-Rojo', 'Chaqueta Formal Mujer L Rojo', 5, '{\"Talla\": \"L\", \"Color\": \"Rojo\", \"Material\": \"Lino\", \"Uso\": \"Formal\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(30, 'Chaqueta Formal Mujer-L-Azul', 'Chaqueta Formal Mujer L Azul', 5, '{\"Talla\": \"L\", \"Color\": \"Azul\", \"Material\": \"Lino\", \"Uso\": \"Formal\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(31, 'Camiseta Deportiva Hombre-XL-Rojo', 'Camiseta Deportiva Hombre XL Rojo', 1, '{\"Talla\": \"XL\", \"Color\": \"Rojo\", \"Material\": \"Poliéster\", \"Uso\": \"Deportivo\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(32, 'Camiseta Deportiva Hombre-XL-Azul', 'Camiseta Deportiva Hombre XL Azul', 1, '{\"Talla\": \"XL\", \"Color\": \"Azul\", \"Material\": \"Poliéster\", \"Uso\": \"Deportivo\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(33, 'Pantalón Casual Mujer-XL-Rojo', 'Pantalón Casual Mujer XL Rojo', 2, '{\"Talla\": \"XL\", \"Color\": \"Rojo\", \"Material\": \"Algodón\", \"Uso\": \"Casual\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(34, 'Pantalón Casual Mujer-XL-Azul', 'Pantalón Casual Mujer XL Azul', 2, '{\"Talla\": \"XL\", \"Color\": \"Azul\", \"Material\": \"Algodón\", \"Uso\": \"Casual\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(35, 'Camiseta Verano Niño-XL-Rojo', 'Camiseta Verano Niño XL Rojo', 3, '{\"Talla\": \"XL\", \"Color\": \"Rojo\", \"Material\": \"Algodón\", \"Uso\": \"Casual\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(36, 'Camiseta Verano Niño-XL-Azul', 'Camiseta Verano Niño XL Azul', 3, '{\"Talla\": \"XL\", \"Color\": \"Azul\", \"Material\": \"Algodón\", \"Uso\": \"Casual\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(37, 'Short Deportivo Hombre-XL-Rojo', 'Short Deportivo Hombre XL Rojo', 4, '{\"Talla\": \"XL\", \"Color\": \"Rojo\", \"Material\": \"Poliéster\", \"Uso\": \"Deportivo\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(38, 'Short Deportivo Hombre-XL-Azul', 'Short Deportivo Hombre XL Azul', 4, '{\"Talla\": \"XL\", \"Color\": \"Azul\", \"Material\": \"Poliéster\", \"Uso\": \"Deportivo\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(39, 'Chaqueta Formal Mujer-XL-Rojo', 'Chaqueta Formal Mujer XL Rojo', 5, '{\"Talla\": \"XL\", \"Color\": \"Rojo\", \"Material\": \"Lino\", \"Uso\": \"Formal\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(40, 'Chaqueta Formal Mujer-XL-Azul', 'Chaqueta Formal Mujer XL Azul', 5, '{\"Talla\": \"XL\", \"Color\": \"Azul\", \"Material\": \"Lino\", \"Uso\": \"Formal\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(41, 'Camiseta Deportiva Hombre-XXL-Rojo', 'Camiseta Deportiva Hombre XXL Rojo', 1, '{\"Talla\": \"XXL\", \"Color\": \"Rojo\", \"Material\": \"Poliéster\", \"Uso\": \"Deportivo\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(42, 'Camiseta Deportiva Hombre-XXL-Azul', 'Camiseta Deportiva Hombre XXL Azul', 1, '{\"Talla\": \"XXL\", \"Color\": \"Azul\", \"Material\": \"Poliéster\", \"Uso\": \"Deportivo\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(43, 'Pantalón Casual Mujer-XXL-Rojo', 'Pantalón Casual Mujer XXL Rojo', 2, '{\"Talla\": \"XXL\", \"Color\": \"Rojo\", \"Material\": \"Algodón\", \"Uso\": \"Casual\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(44, 'Pantalón Casual Mujer-XXL-Azul', 'Pantalón Casual Mujer XXL Azul', 2, '{\"Talla\": \"XXL\", \"Color\": \"Azul\", \"Material\": \"Algodón\", \"Uso\": \"Casual\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(45, 'Camiseta Verano Niño-XXL-Rojo', 'Camiseta Verano Niño XXL Rojo', 3, '{\"Talla\": \"XXL\", \"Color\": \"Rojo\", \"Material\": \"Algodón\", \"Uso\": \"Casual\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(46, 'Camiseta Verano Niño-XXL-Azul', 'Camiseta Verano Niño XXL Azul', 3, '{\"Talla\": \"XXL\", \"Color\": \"Azul\", \"Material\": \"Algodón\", \"Uso\": \"Casual\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(47, 'Short Deportivo Hombre-XXL-Rojo', 'Short Deportivo Hombre XXL Rojo', 4, '{\"Talla\": \"XXL\", \"Color\": \"Rojo\", \"Material\": \"Poliéster\", \"Uso\": \"Deportivo\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(48, 'Short Deportivo Hombre-XXL-Azul', 'Short Deportivo Hombre XXL Azul', 4, '{\"Talla\": \"XXL\", \"Color\": \"Azul\", \"Material\": \"Poliéster\", \"Uso\": \"Deportivo\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(49, 'Chaqueta Formal Mujer-XXL-Rojo', 'Chaqueta Formal Mujer XXL Rojo', 5, '{\"Talla\": \"XXL\", \"Color\": \"Rojo\", \"Material\": \"Lino\", \"Uso\": \"Formal\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(50, 'Chaqueta Formal Mujer-XXL-Azul', 'Chaqueta Formal Mujer XXL Azul', 5, '{\"Talla\": \"XXL\", \"Color\": \"Azul\", \"Material\": \"Lino\", \"Uso\": \"Formal\"}', '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenproducto`
--

CREATE TABLE `imagenproducto` (
  `ImagenId` int(11) NOT NULL,
  `ProductoId` int(11) DEFAULT NULL,
  `Url` varchar(200) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `InventarioId` int(11) NOT NULL,
  `EnvaseId` int(11) DEFAULT NULL,
  `AlmacenId` int(11) DEFAULT NULL,
  `Cantidad` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario`
--

INSERT INTO `inventario` (`InventarioId`, `EnvaseId`, `AlmacenId`, `Cantidad`, `createdAt`, `updatedAt`, `isActive`) VALUES
(1, 1, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(2, 2, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(3, 11, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(4, 12, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(5, 21, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(6, 22, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(7, 31, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(8, 32, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(9, 41, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(10, 42, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(11, 3, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(12, 4, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(13, 13, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(14, 14, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(15, 23, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(16, 24, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(17, 33, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(18, 34, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(19, 43, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(20, 44, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(21, 5, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(22, 6, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(23, 15, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(24, 16, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(25, 25, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(26, 26, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(27, 35, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(28, 36, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(29, 45, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(30, 46, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(31, 7, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(32, 8, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(33, 17, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(34, 18, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(35, 27, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(36, 28, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(37, 37, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(38, 38, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(39, 47, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(40, 48, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(41, 9, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(42, 10, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(43, 19, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(44, 20, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(45, 29, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(46, 30, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(47, 39, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(48, 40, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(49, 49, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1),
(50, 50, 1, 100, '2025-05-22 11:41:23', '2025-05-22 11:41:23', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `itemorden`
--

CREATE TABLE `itemorden` (
  `ItemOrdenId` int(11) NOT NULL,
  `OrdenId` int(11) DEFAULT NULL,
  `EnvaseId` int(11) DEFAULT NULL,
  `Cantidad` int(11) DEFAULT NULL,
  `PrecioUnitario` decimal(18,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marca`
--

CREATE TABLE `marca` (
  `MarcaId` int(11) NOT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  `LogoUrl` varchar(200) DEFAULT NULL,
  `ProveedorId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `marca`
--

INSERT INTO `marca` (`MarcaId`, `Nombre`, `LogoUrl`, `ProveedorId`, `createdAt`, `updatedAt`, `isActive`) VALUES
(1, 'Nike', 'https://nike.com/logo.png', 1, '2025-05-22 11:39:17', '2025-05-22 11:39:17', 1),
(2, 'Adidas', 'https://adidas.com/logo.png', NULL, '2025-05-22 11:39:17', '2025-05-22 11:39:17', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensaje`
--

CREATE TABLE `mensaje` (
  `MensajeId` int(11) NOT NULL,
  `SesionId` int(11) DEFAULT NULL,
  `FechaEnvio` datetime DEFAULT current_timestamp(),
  `Direccion` enum('Entrante','Saliente') DEFAULT NULL,
  `Contenido` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden`
--

CREATE TABLE `orden` (
  `OrdenId` int(11) NOT NULL,
  `ClienteId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `precio`
--

CREATE TABLE `precio` (
  `PrecioId` int(11) NOT NULL,
  `EnvaseId` int(11) DEFAULT NULL,
  `TipoPrecio` enum('Minorista','Mayorista','Bloque') DEFAULT NULL,
  `UmbralCantidad` int(11) DEFAULT NULL,
  `Monto` decimal(18,2) DEFAULT NULL,
  `VigenteDesde` datetime DEFAULT NULL,
  `VigenteHasta` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `precio`
--

INSERT INTO `precio` (`PrecioId`, `EnvaseId`, `TipoPrecio`, `UmbralCantidad`, `Monto`, `VigenteDesde`, `VigenteHasta`, `createdAt`, `updatedAt`, `isActive`) VALUES
(1, 1, 'Minorista', NULL, 20.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(2, 2, 'Minorista', NULL, 20.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(3, 3, 'Minorista', NULL, 20.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(4, 4, 'Minorista', NULL, 20.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(5, 5, 'Minorista', NULL, 20.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(6, 6, 'Minorista', NULL, 20.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(7, 7, 'Minorista', NULL, 20.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(8, 8, 'Minorista', NULL, 20.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(9, 9, 'Minorista', NULL, 20.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(10, 10, 'Minorista', NULL, 20.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(11, 11, 'Minorista', NULL, 22.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(12, 12, 'Minorista', NULL, 22.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(13, 13, 'Minorista', NULL, 22.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(14, 14, 'Minorista', NULL, 22.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(15, 15, 'Minorista', NULL, 22.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(16, 16, 'Minorista', NULL, 22.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(17, 17, 'Minorista', NULL, 22.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(18, 18, 'Minorista', NULL, 22.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(19, 19, 'Minorista', NULL, 22.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(20, 20, 'Minorista', NULL, 22.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(21, 21, 'Minorista', NULL, 24.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(22, 22, 'Minorista', NULL, 24.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(23, 23, 'Minorista', NULL, 24.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(24, 24, 'Minorista', NULL, 24.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(25, 25, 'Minorista', NULL, 24.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(26, 26, 'Minorista', NULL, 24.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(27, 27, 'Minorista', NULL, 24.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(28, 28, 'Minorista', NULL, 24.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(29, 29, 'Minorista', NULL, 24.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(30, 30, 'Minorista', NULL, 24.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(31, 31, 'Minorista', NULL, 26.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(32, 32, 'Minorista', NULL, 26.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(33, 33, 'Minorista', NULL, 26.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(34, 34, 'Minorista', NULL, 26.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(35, 35, 'Minorista', NULL, 26.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(36, 36, 'Minorista', NULL, 26.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(37, 37, 'Minorista', NULL, 26.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(38, 38, 'Minorista', NULL, 26.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(39, 39, 'Minorista', NULL, 26.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(40, 40, 'Minorista', NULL, 26.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(41, 41, 'Minorista', NULL, 28.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(42, 42, 'Minorista', NULL, 28.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(43, 43, 'Minorista', NULL, 28.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(44, 44, 'Minorista', NULL, 28.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(45, 45, 'Minorista', NULL, 28.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(46, 46, 'Minorista', NULL, 28.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(47, 47, 'Minorista', NULL, 28.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(48, 48, 'Minorista', NULL, 28.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(49, 49, 'Minorista', NULL, 28.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(50, 50, 'Minorista', NULL, 28.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(64, 1, 'Mayorista', 10, 18.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(65, 2, 'Mayorista', 10, 18.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(66, 3, 'Mayorista', 10, 18.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(67, 4, 'Mayorista', 10, 18.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(68, 5, 'Mayorista', 10, 18.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(69, 6, 'Mayorista', 10, 18.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(70, 7, 'Mayorista', 10, 18.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(71, 8, 'Mayorista', 10, 18.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(72, 9, 'Mayorista', 10, 18.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(73, 10, 'Mayorista', 10, 18.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(74, 11, 'Mayorista', 10, 19.80, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(75, 12, 'Mayorista', 10, 19.80, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(76, 13, 'Mayorista', 10, 19.80, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(77, 14, 'Mayorista', 10, 19.80, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(78, 15, 'Mayorista', 10, 19.80, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(79, 16, 'Mayorista', 10, 19.80, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(80, 17, 'Mayorista', 10, 19.80, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(81, 18, 'Mayorista', 10, 19.80, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(82, 19, 'Mayorista', 10, 19.80, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(83, 20, 'Mayorista', 10, 19.80, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(84, 21, 'Mayorista', 10, 21.60, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(85, 22, 'Mayorista', 10, 21.60, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(86, 23, 'Mayorista', 10, 21.60, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(87, 24, 'Mayorista', 10, 21.60, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(88, 25, 'Mayorista', 10, 21.60, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(89, 26, 'Mayorista', 10, 21.60, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(90, 27, 'Mayorista', 10, 21.60, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(91, 28, 'Mayorista', 10, 21.60, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(92, 29, 'Mayorista', 10, 21.60, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(93, 30, 'Mayorista', 10, 21.60, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(94, 31, 'Mayorista', 10, 23.40, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(95, 32, 'Mayorista', 10, 23.40, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(96, 33, 'Mayorista', 10, 23.40, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(97, 34, 'Mayorista', 10, 23.40, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(98, 35, 'Mayorista', 10, 23.40, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(99, 36, 'Mayorista', 10, 23.40, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(100, 37, 'Mayorista', 10, 23.40, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(101, 38, 'Mayorista', 10, 23.40, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(102, 39, 'Mayorista', 10, 23.40, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(103, 40, 'Mayorista', 10, 23.40, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(104, 41, 'Mayorista', 10, 25.20, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(105, 42, 'Mayorista', 10, 25.20, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(106, 43, 'Mayorista', 10, 25.20, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(107, 44, 'Mayorista', 10, 25.20, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(108, 45, 'Mayorista', 10, 25.20, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(109, 46, 'Mayorista', 10, 25.20, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(110, 47, 'Mayorista', 10, 25.20, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(111, 48, 'Mayorista', 10, 25.20, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(112, 49, 'Mayorista', 10, 25.20, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(113, 50, 'Mayorista', 10, 25.20, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(127, 1, 'Bloque', 5, 90.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(128, 2, 'Bloque', 5, 90.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(129, 3, 'Bloque', 5, 90.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(130, 4, 'Bloque', 5, 90.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(131, 5, 'Bloque', 5, 90.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(132, 6, 'Bloque', 5, 90.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(133, 7, 'Bloque', 5, 90.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(134, 8, 'Bloque', 5, 90.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(135, 9, 'Bloque', 5, 90.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(136, 10, 'Bloque', 5, 90.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(137, 11, 'Bloque', 5, 99.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(138, 12, 'Bloque', 5, 99.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(139, 13, 'Bloque', 5, 99.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(140, 14, 'Bloque', 5, 99.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(141, 15, 'Bloque', 5, 99.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(142, 16, 'Bloque', 5, 99.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(143, 17, 'Bloque', 5, 99.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(144, 18, 'Bloque', 5, 99.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(145, 19, 'Bloque', 5, 99.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(146, 20, 'Bloque', 5, 99.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(147, 21, 'Bloque', 5, 108.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(148, 22, 'Bloque', 5, 108.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(149, 23, 'Bloque', 5, 108.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(150, 24, 'Bloque', 5, 108.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(151, 25, 'Bloque', 5, 108.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(152, 26, 'Bloque', 5, 108.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(153, 27, 'Bloque', 5, 108.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(154, 28, 'Bloque', 5, 108.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(155, 29, 'Bloque', 5, 108.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(156, 30, 'Bloque', 5, 108.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(157, 31, 'Bloque', 5, 117.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(158, 32, 'Bloque', 5, 117.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(159, 33, 'Bloque', 5, 117.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(160, 34, 'Bloque', 5, 117.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(161, 35, 'Bloque', 5, 117.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(162, 36, 'Bloque', 5, 117.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(163, 37, 'Bloque', 5, 117.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(164, 38, 'Bloque', 5, 117.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(165, 39, 'Bloque', 5, 117.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(166, 40, 'Bloque', 5, 117.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(167, 41, 'Bloque', 5, 126.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(168, 42, 'Bloque', 5, 126.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(169, 43, 'Bloque', 5, 126.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(170, 44, 'Bloque', 5, 126.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(171, 45, 'Bloque', 5, 126.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(172, 46, 'Bloque', 5, 126.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(173, 47, 'Bloque', 5, 126.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(174, 48, 'Bloque', 5, 126.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(175, 49, 'Bloque', 5, 126.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1),
(176, 50, 'Bloque', 5, 126.00, '2025-01-01 00:00:00', NULL, '2025-05-22 11:51:03', '2025-05-22 11:51:03', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `ProductoId` int(11) NOT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  `MarcaId` int(11) DEFAULT NULL,
  `CategoriaId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`ProductoId`, `Nombre`, `MarcaId`, `CategoriaId`, `createdAt`, `updatedAt`, `isActive`) VALUES
(1, 'Camiseta Deportiva Hombre', 1, 4, '2025-05-22 11:39:17', '2025-05-22 11:39:17', 1),
(2, 'Pantalón Casual Mujer', NULL, 7, '2025-05-22 11:39:17', '2025-05-22 11:39:17', 1),
(3, 'Camiseta Verano Niño', 1, 8, '2025-05-22 11:39:17', '2025-05-22 11:39:17', 1),
(4, 'Short Deportivo Hombre', 1, 5, '2025-05-22 11:39:17', '2025-05-22 11:39:17', 1),
(5, 'Chaqueta Formal Mujer', NULL, 6, '2025-05-22 11:39:17', '2025-05-22 11:39:17', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `ProveedorId` int(11) NOT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  `Contacto` varchar(200) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedor`
--

INSERT INTO `proveedor` (`ProveedorId`, `Nombre`, `Contacto`, `createdAt`, `updatedAt`, `isActive`) VALUES
(1, 'Nike Inc.', 'contacto@nike.com', '2025-05-22 11:39:17', '2025-05-22 11:39:17', 1),
(2, 'Adidas AG', 'contacto@adidas.com', '2025-05-22 11:39:17', '2025-05-22 11:39:17', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `referido`
--

CREATE TABLE `referido` (
  `ReferidoId` int(11) NOT NULL,
  `ReferidorId` int(11) DEFAULT NULL,
  `ReferidoPorId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sesionchat`
--

CREATE TABLE `sesionchat` (
  `SesionId` int(11) NOT NULL,
  `ClienteId` int(11) DEFAULT NULL,
  `IniciadoEn` datetime DEFAULT current_timestamp(),
  `FinalizadoEn` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sucursal`
--

CREATE TABLE `sucursal` (
  `SucursalId` int(11) NOT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  `Ciudad` varchar(100) DEFAULT NULL,
  `Direccion` varchar(200) DEFAULT NULL,
  `TipoSucursal` enum('WhatsApp','Marketplace','Website','Física') DEFAULT 'WhatsApp',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sucursal`
--

INSERT INTO `sucursal` (`SucursalId`, `Nombre`, `Ciudad`, `Direccion`, `TipoSucursal`, `createdAt`, `updatedAt`, `isActive`) VALUES
(1, 'Canal WhatsApp', 'Online', 'Webhook', 'WhatsApp', '2025-05-22 11:39:17', '2025-05-22 11:39:17', 1);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_campana_ambito`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_campana_ambito` (
`CampanaId` int(11)
,`CampanaNombre` varchar(100)
,`Tipo` enum('Descuento','Promoción','Oferta','Combo','Paquete')
,`FechaInicio` datetime
,`FechaFin` datetime
,`Parámetros` longtext
,`AlcanceId` int(11)
,`TipoAmbito` enum('Producto','Categoría','ClienteTipo')
,`ObjetoId` int(11)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_campana_items`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_campana_items` (
`ItemId` int(11)
,`CampanaId` int(11)
,`EnvaseId` int(11)
,`SKU` varchar(50)
,`EnvaseDescripcion` varchar(100)
,`Cantidad` int(11)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_chat_full`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_chat_full` (
`SesionId` int(11)
,`ClienteId` int(11)
,`ClienteNombre` varchar(100)
,`IniciadoEn` datetime
,`FinalizadoEn` datetime
,`MensajeId` int(11)
,`FechaEnvio` datetime
,`Direccion` enum('Entrante','Saliente')
,`Contenido` text
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_envase_info`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_envase_info` (
`EnvaseId` int(11)
,`SKU` varchar(50)
,`Descripcion` varchar(100)
,`ProductoId` int(11)
,`ProductoNombre` varchar(100)
,`Atributos` longtext
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_itemorden_full`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_itemorden_full` (
`ItemOrdenId` int(11)
,`OrdenId` int(11)
,`EnvaseId` int(11)
,`SKU` varchar(50)
,`EnvaseDescripcion` varchar(100)
,`Cantidad` int(11)
,`PrecioUnitario` decimal(18,2)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_producto_hierarchy`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_producto_hierarchy` (
`ProductoId` int(11)
,`ProductoNombre` varchar(100)
,`MarcaId` int(11)
,`MarcaNombre` varchar(100)
,`ProveedorId` int(11)
,`ProveedorNombre` varchar(100)
,`CategoriaId` int(11)
,`CategoriaNombre` varchar(100)
,`PadreCategoriaId` int(11)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_stock_price`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_stock_price` (
`InventarioId` int(11)
,`EnvaseId` int(11)
,`SKU` varchar(50)
,`AlmacenId` int(11)
,`AlmacenNombre` varchar(100)
,`Cantidad` int(11)
,`PrecioId` int(11)
,`TipoPrecio` enum('Minorista','Mayorista','Bloque')
,`UmbralCantidad` int(11)
,`Monto` decimal(18,2)
,`VigenteDesde` datetime
,`VigenteHasta` datetime
);

-- --------------------------------------------------------

--
-- Estructura para la vista `v_campana_ambito`
--
DROP TABLE IF EXISTS `v_campana_ambito`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_campana_ambito`  AS SELECT `ca`.`CampanaId` AS `CampanaId`, `ca`.`Nombre` AS `CampanaNombre`, `ca`.`Tipo` AS `Tipo`, `ca`.`FechaInicio` AS `FechaInicio`, `ca`.`FechaFin` AS `FechaFin`, `ca`.`Parámetros` AS `Parámetros`, `amb`.`AlcanceId` AS `AlcanceId`, `amb`.`TipoAmbito` AS `TipoAmbito`, `amb`.`ObjetoId` AS `ObjetoId` FROM (`campana` `ca` left join `campanaambito` `amb` on(`ca`.`CampanaId` = `amb`.`CampanaId`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_campana_items`
--
DROP TABLE IF EXISTS `v_campana_items`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_campana_items`  AS SELECT `ci`.`ItemId` AS `ItemId`, `ci`.`CampanaId` AS `CampanaId`, `ci`.`EnvaseId` AS `EnvaseId`, `e`.`SKU` AS `SKU`, `e`.`Descripcion` AS `EnvaseDescripcion`, `ci`.`Cantidad` AS `Cantidad` FROM (`campanaitem` `ci` join `envaseproducto` `e` on(`ci`.`EnvaseId` = `e`.`EnvaseId`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_chat_full`
--
DROP TABLE IF EXISTS `v_chat_full`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_chat_full`  AS SELECT `sc`.`SesionId` AS `SesionId`, `sc`.`ClienteId` AS `ClienteId`, `cl`.`Nombre` AS `ClienteNombre`, `sc`.`IniciadoEn` AS `IniciadoEn`, `sc`.`FinalizadoEn` AS `FinalizadoEn`, `msg`.`MensajeId` AS `MensajeId`, `msg`.`FechaEnvio` AS `FechaEnvio`, `msg`.`Direccion` AS `Direccion`, `msg`.`Contenido` AS `Contenido` FROM ((`sesionchat` `sc` join `cliente` `cl` on(`sc`.`ClienteId` = `cl`.`ClienteId`)) left join `mensaje` `msg` on(`sc`.`SesionId` = `msg`.`SesionId`)) ORDER BY `sc`.`SesionId` ASC, `msg`.`FechaEnvio` ASC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_envase_info`
--
DROP TABLE IF EXISTS `v_envase_info`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_envase_info`  AS SELECT `e`.`EnvaseId` AS `EnvaseId`, `e`.`SKU` AS `SKU`, `e`.`Descripcion` AS `Descripcion`, `e`.`ProductoId` AS `ProductoId`, `p`.`Nombre` AS `ProductoNombre`, `e`.`Atributos` AS `Atributos` FROM (`envaseproducto` `e` join `producto` `p` on(`e`.`ProductoId` = `p`.`ProductoId`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_itemorden_full`
--
DROP TABLE IF EXISTS `v_itemorden_full`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_itemorden_full`  AS SELECT `ion`.`ItemOrdenId` AS `ItemOrdenId`, `ion`.`OrdenId` AS `OrdenId`, `ion`.`EnvaseId` AS `EnvaseId`, `e`.`SKU` AS `SKU`, `e`.`Descripcion` AS `EnvaseDescripcion`, `ion`.`Cantidad` AS `Cantidad`, `ion`.`PrecioUnitario` AS `PrecioUnitario` FROM (`itemorden` `ion` join `envaseproducto` `e` on(`ion`.`EnvaseId` = `e`.`EnvaseId`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_producto_hierarchy`
--
DROP TABLE IF EXISTS `v_producto_hierarchy`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_producto_hierarchy`  AS SELECT `p`.`ProductoId` AS `ProductoId`, `p`.`Nombre` AS `ProductoNombre`, `m`.`MarcaId` AS `MarcaId`, `m`.`Nombre` AS `MarcaNombre`, `pr`.`ProveedorId` AS `ProveedorId`, `pr`.`Nombre` AS `ProveedorNombre`, `c`.`CategoriaId` AS `CategoriaId`, `c`.`Nombre` AS `CategoriaNombre`, `c`.`PadreCategoriaId` AS `PadreCategoriaId` FROM (((`producto` `p` join `marca` `m` on(`p`.`MarcaId` = `m`.`MarcaId`)) join `proveedor` `pr` on(`m`.`ProveedorId` = `pr`.`ProveedorId`)) join `categoria` `c` on(`p`.`CategoriaId` = `c`.`CategoriaId`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_stock_price`
--
DROP TABLE IF EXISTS `v_stock_price`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_stock_price`  AS SELECT `inv`.`InventarioId` AS `InventarioId`, `inv`.`EnvaseId` AS `EnvaseId`, `e`.`SKU` AS `SKU`, `inv`.`AlmacenId` AS `AlmacenId`, `al`.`Nombre` AS `AlmacenNombre`, `inv`.`Cantidad` AS `Cantidad`, `prc`.`PrecioId` AS `PrecioId`, `prc`.`TipoPrecio` AS `TipoPrecio`, `prc`.`UmbralCantidad` AS `UmbralCantidad`, `prc`.`Monto` AS `Monto`, `prc`.`VigenteDesde` AS `VigenteDesde`, `prc`.`VigenteHasta` AS `VigenteHasta` FROM (((`inventario` `inv` join `envaseproducto` `e` on(`inv`.`EnvaseId` = `e`.`EnvaseId`)) join `almacen` `al` on(`inv`.`AlmacenId` = `al`.`AlmacenId`)) left join `precio` `prc` on(`prc`.`EnvaseId` = `e`.`EnvaseId`)) ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `almacen`
--
ALTER TABLE `almacen`
  ADD PRIMARY KEY (`AlmacenId`),
  ADD KEY `SucursalId` (`SucursalId`);

--
-- Indices de la tabla `campana`
--
ALTER TABLE `campana`
  ADD PRIMARY KEY (`CampanaId`);

--
-- Indices de la tabla `campanaambito`
--
ALTER TABLE `campanaambito`
  ADD PRIMARY KEY (`AlcanceId`),
  ADD KEY `CampanaId` (`CampanaId`);

--
-- Indices de la tabla `campanaitem`
--
ALTER TABLE `campanaitem`
  ADD PRIMARY KEY (`ItemId`),
  ADD KEY `CampanaId` (`CampanaId`),
  ADD KEY `EnvaseId` (`EnvaseId`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`CategoriaId`),
  ADD KEY `PadreCategoriaId` (`PadreCategoriaId`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`ClienteId`);

--
-- Indices de la tabla `cuentafidelidad`
--
ALTER TABLE `cuentafidelidad`
  ADD PRIMARY KEY (`CuentaId`),
  ADD KEY `ClienteId` (`ClienteId`);

--
-- Indices de la tabla `envaseproducto`
--
ALTER TABLE `envaseproducto`
  ADD PRIMARY KEY (`EnvaseId`),
  ADD KEY `ProductoId` (`ProductoId`);

--
-- Indices de la tabla `imagenproducto`
--
ALTER TABLE `imagenproducto`
  ADD PRIMARY KEY (`ImagenId`),
  ADD KEY `ProductoId` (`ProductoId`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`InventarioId`),
  ADD KEY `EnvaseId` (`EnvaseId`),
  ADD KEY `AlmacenId` (`AlmacenId`);

--
-- Indices de la tabla `itemorden`
--
ALTER TABLE `itemorden`
  ADD PRIMARY KEY (`ItemOrdenId`),
  ADD KEY `OrdenId` (`OrdenId`),
  ADD KEY `EnvaseId` (`EnvaseId`);

--
-- Indices de la tabla `marca`
--
ALTER TABLE `marca`
  ADD PRIMARY KEY (`MarcaId`),
  ADD KEY `ProveedorId` (`ProveedorId`);

--
-- Indices de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  ADD PRIMARY KEY (`MensajeId`),
  ADD KEY `SesionId` (`SesionId`);

--
-- Indices de la tabla `orden`
--
ALTER TABLE `orden`
  ADD PRIMARY KEY (`OrdenId`),
  ADD KEY `ClienteId` (`ClienteId`);

--
-- Indices de la tabla `precio`
--
ALTER TABLE `precio`
  ADD PRIMARY KEY (`PrecioId`),
  ADD KEY `EnvaseId` (`EnvaseId`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`ProductoId`),
  ADD KEY `MarcaId` (`MarcaId`),
  ADD KEY `CategoriaId` (`CategoriaId`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`ProveedorId`);

--
-- Indices de la tabla `referido`
--
ALTER TABLE `referido`
  ADD PRIMARY KEY (`ReferidoId`),
  ADD KEY `ReferidorId` (`ReferidorId`),
  ADD KEY `ReferidoPorId` (`ReferidoPorId`);

--
-- Indices de la tabla `sesionchat`
--
ALTER TABLE `sesionchat`
  ADD PRIMARY KEY (`SesionId`),
  ADD KEY `ClienteId` (`ClienteId`);

--
-- Indices de la tabla `sucursal`
--
ALTER TABLE `sucursal`
  ADD PRIMARY KEY (`SucursalId`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `almacen`
--
ALTER TABLE `almacen`
  MODIFY `AlmacenId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `campana`
--
ALTER TABLE `campana`
  MODIFY `CampanaId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `campanaambito`
--
ALTER TABLE `campanaambito`
  MODIFY `AlcanceId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `campanaitem`
--
ALTER TABLE `campanaitem`
  MODIFY `ItemId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `CategoriaId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `ClienteId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cuentafidelidad`
--
ALTER TABLE `cuentafidelidad`
  MODIFY `CuentaId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `envaseproducto`
--
ALTER TABLE `envaseproducto`
  MODIFY `EnvaseId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT de la tabla `imagenproducto`
--
ALTER TABLE `imagenproducto`
  MODIFY `ImagenId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `InventarioId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT de la tabla `itemorden`
--
ALTER TABLE `itemorden`
  MODIFY `ItemOrdenId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `marca`
--
ALTER TABLE `marca`
  MODIFY `MarcaId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  MODIFY `MensajeId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `orden`
--
ALTER TABLE `orden`
  MODIFY `OrdenId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `precio`
--
ALTER TABLE `precio`
  MODIFY `PrecioId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=190;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `ProductoId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `ProveedorId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `referido`
--
ALTER TABLE `referido`
  MODIFY `ReferidoId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sesionchat`
--
ALTER TABLE `sesionchat`
  MODIFY `SesionId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sucursal`
--
ALTER TABLE `sucursal`
  MODIFY `SucursalId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
