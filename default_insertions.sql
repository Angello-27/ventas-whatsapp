-- Marcas
INSERT INTO `marca` (`Nombre`, `LogoUrl`)
VALUES (
        'Abercrombie & Fitch',
        'imagen/marca/abercrombie.png'
    ),
    ('Adidas', 'imagen/marca/adidas.png'),
    (
        'American Eagle Outfitters',
        'imagen/marca/american-eagle.png'
    ),
    (
        'Calvin Klein',
        'imagen/marca/calvin-klein.png'
    ),
    ('Gap', 'imagen/marca/gap.png'),
    ('Hollister', 'imagen/marca/hollister.png'),
    ('Lacoste', 'imagen/marca/lacoste.png'),
    ('Nike', 'imagen/marca/nike.png'),
    ('Puma', 'imagen/marca/puma.png'),
    (
        'Under Armour',
        'imagen/marca/under-armour.png'
    ),
    (
        'Zara',
        'imagen/marca/zara.png'
    );
-- Categorías
INSERT INTO `categoria` (`Nombre`, `PadreCategoriaId`)
VALUES ('Ropa Superior', NULL),
    ('Ropa Inferior', NULL),
    ('Abrigos', NULL),
    ('Accesorios', NULL),
    ('Musculosas', 1),
    ('Poleras', 1),
    ('Camisas', 1),
    ('Blusas', 1),
    ('Vestidos', 1),
    ('Pantalones', 2),
    ('Shorts', 2),
    ('Faldas', 2),
    ('Parkas', 3),
    ('Chompas', 3),
    ('Chamarras', 3),
    ('Sudaderas', 3),
    ('Gorras', 4),
    ('Bufandas', 4),
    ('Cinturones', 4),
    ('Sombreros', 4);
-- vistaproductos
select `p`.`ProductoId` AS `productoId`,
    `p`.`Nombre` AS `nombre`,
    `p`.`Genero` AS `genero`,
    `p`.`MarcaId` AS `marcaId`,
    `m`.`Nombre` AS `marcaNombre`,
    `m`.`LogoUrl` AS `logoUrl`,
    `p`.`CategoriaId` AS `categoriaId`,
    `c`.`Nombre` AS `categoriaNombre`,
    `p`.`createdAt` AS `createdAt`
from (
        (
            `whatsapp_sales`.`productos` `p`
            join `whatsapp_sales`.`marca` `m` on(`p`.`MarcaId` = `m`.`MarcaId`)
        )
        join `whatsapp_sales`.`categoria` `c` on(`p`.`CategoriaId` = `c`.`CategoriaId`)
    )
where `p`.`isActive` = 1
    and `m`.`isActive` = 1
    and `c`.`isActive` = 1;
-- vistavariantesproductos
select `v`.`VarianteId` AS `varianteId`,
    `v`.`SKU` AS `sku`,
    `p`.`ProductoId` AS `productoId`,
    `p`.`Nombre` AS `productoNombre`,
    `v`.`Color` AS `color`,
    `v`.`Talla` AS `talla`,
    `v`.`Material` AS `material`,
    `v`.`PrecioVenta` AS `precioVenta`,
    `v`.`Cantidad` AS `cantidad`,
    `img`.`Url` AS `imagenPrincipalUrl`,
    `v`.`createdAt` AS `createdAt`
from (
        (
            `whatsapp_sales`.`productovariantes` `v`
            join `whatsapp_sales`.`productos` `p` on(`v`.`ProductoId` = `p`.`ProductoId`)
        )
        left join `whatsapp_sales`.`productoimagenes` `img` on(`v`.`VarianteId` = `img`.`VarianteId`)
    )
where `v`.`isActive` = 1
    and `p`.`isActive` = 1
    and (
        `img`.`isActive` = 1
        or `img`.`isActive` is null
    );