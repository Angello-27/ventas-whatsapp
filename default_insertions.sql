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