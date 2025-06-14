// generateInserts.js

const fs = require('fs');
const path = require('path');

// Abre un WriteStream para product_insert.sql en la raíz
const outputPath = path.resolve(__dirname, 'product_insertions.sql');
const out = fs.createWriteStream(outputPath, { encoding: 'utf8' });

// Una función auxiliar en lugar de console.log:
function write(sql) {
    out.write(sql + '\n');
}

// Genera INSERTs para tablas: productos, productovariantes, promociones, promocion_variantes
// Incluye reglas para géneros, categorías, materiales, variantes y promociones aleatorias.

const brands = [
    { id: 1, name: 'Abercrombie & Fitch' },
    { id: 2, name: 'Adidas' },
    { id: 3, name: 'American Eagle Outfitters' },
    { id: 4, name: 'Calvin Klein' },
    { id: 5, name: 'Gap' },
    { id: 6, name: 'Hollister' },
    { id: 7, name: 'Lacoste' },
    { id: 8, name: 'Nike' },
    { id: 9, name: 'Puma' },
    { id: 10, name: 'Under Armour' },
    { id: 11, name: 'Zara' },
];

// 1) Categorías, ordenadas por id (tal como en tu CSV)
const categories = [
    { id: 5, name: 'Musculosas', singular: 'Musculosa', priceRange: [35, 70] },
    { id: 6, name: 'Poleras', singular: 'Polera', priceRange: [40, 90] },
    { id: 7, name: 'Camisas', singular: 'Camisa', priceRange: [60, 140] },
    { id: 8, name: 'Blusas', singular: 'Blusa', priceRange: [60, 120] },
    { id: 9, name: 'Vestidos', singular: 'Vestido', priceRange: [80, 220] },
    { id: 10, name: 'Pantalones', singular: 'Pantalón', priceRange: [80, 200] },
    { id: 11, name: 'Shorts', singular: 'Shorts', priceRange: [50, 120] },
    { id: 12, name: 'Faldas', singular: 'Falda', priceRange: [60, 140] },
    { id: 13, name: 'Parkas', singular: 'Parka', priceRange: [180, 400] },
    { id: 14, name: 'Chompas', singular: 'Chompa', priceRange: [90, 240] },
    { id: 15, name: 'Chamarras', singular: 'Chamarra', priceRange: [150, 350] },
    { id: 16, name: 'Sudaderas', singular: 'Sudadera', priceRange: [80, 180] },
    { id: 17, name: 'Gorras', singular: 'Gorra', priceRange: [25, 60] },
    { id: 18, name: 'Bufandas', singular: 'Bufanda', priceRange: [30, 80] },
    { id: 19, name: 'Cinturones', singular: 'Cinturón', priceRange: [25, 80] },
    { id: 20, name: 'Sombreros', singular: 'Sombrero', priceRange: [40, 120] },
];

// Géneros permitidos globalmente
const genders = ['Hombre', 'Mujer', 'Niños', 'Unisex'];
// 2) Categorías femeninas (siguen siendo las mismas)
const femaleCats = [8, 9, 12]; // Blusas, Vestidos, Faldas

// Fechas de inicio y fin según temporada (hemisferio sur, Bolivia)
const seasons = ['Verano', 'Invierno'];
const seasonDates = {
    Verano: { start: '2025-12-01', end: '2026-03-31' },
    Invierno: { start: '2025-06-01', end: '2025-08-31' }
};

// opciones de promoción
const promoKeywords = ['Rebaja', 'Oferta', 'Descuento', 'Liquidación', 'Promoción'];
const discountOptions = [5, 10, 15, 20, 25, 30];

// Tallas y colores
const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
const colors = ['Rojo', 'Azul', 'Verde', 'Negro', 'Blanco', 'Amarillo', 'Morado', 'Marrón', 'Gris', 'Rosa'];

// Materiales y restricciones por categoría
const generalMaterials = ['Nylon', 'Algodón', 'Poliéster', 'Seda', 'Lino', 'Mezclilla', 'Cuero'];
// 3) Materiales poco habituales o no indicados para cada categoría:
const bannedMaterials = {
    5: ['Seda', 'Lino', 'Cuero', 'Mezclilla'],           // Musculosa: prefieren algodón/poliéster/nylon
    6: ['Cuero', 'Mezclilla'],                           // Poleras: no cuero ni denim
    7: ['Cuero'],                                        // Camisas: casi nunca de cuero
    8: ['Cuero', 'Mezclilla'],                           // Blusas: telas ligeras, no cuero ni denim
    9: ['Cuero'],                                        // Vestidos: raramente de cuero en uso cotidiano
    10: [],                                              // Pantalones: todos los materiales posibles
    11: ['Seda'],                                        // Shorts: difícil mantener caída de seda
    12: ['Cuero'],                                       // Faldas: pocas faldas de cuero
    13: ['Seda', 'Lino', 'Mezclilla'],                   // Parkas: requieren tejidos resistentes e impermeables
    14: ['Seda', 'Lino', 'Mezclilla'],                   // Chompas: punto grueso, no seda/linen/denim
    15: ['Seda', 'Lino', 'Mezclilla'],                   // Chamarras: necesitan tejidos robustos
    16: ['Seda', 'Lino', 'Mezclilla', 'Cuero'],          // Sudaderas: prefieren algodón/poliéster/nylon
    17: ['Seda', 'Lino', 'Mezclilla', 'Cuero'],          // Gorras: tejidos ligeros/cotton/poly usual
    18: ['Mezclilla', 'Cuero'],                          // Bufandas: suaves, no rígidos como denim/cuero
    19: ['Seda', 'Lino'],                                // Cinturones: requieren más estructura
    20: ['Seda', 'Lino', 'Mezclilla', 'Cuero'],          // Sombreros: de este listado solo quitamos lo común
};
// 4) materiales exclusivos por categoría (no están en generalMaterials)
const exclusiveMaterials = {
    5: ['Lana'],                // Musculosa: tejido de lana
    8: ['Chifón'],              // Blusas: tejido ligero y transparente
    9: ['Chifón'],              // Vestidos: caída ligera y fluida
    12: ['Tul'],                // Faldas: telas capaas o de vuelo
    13: ['Gore-Tex'],           // Parkas: tejido impermeable/transpirable
    14: ['Lana'],               // Chompas: punto grueso de lana
    15: ['Plumón', 'Gamuza'],   // Chamarras: relleno de plumón o gamuza
    16: ['Felpa'],               // Sudaderas: tejido de felpa/polar
    17: ['Acrílico'],           // Gorras: punto/acrílico en invierno
    18: ['Cachemira'],          // Bufandas: fibra suave de cachemira
    19: ['Elástico', 'Gamuza'], // Cinturones: banda elástico o gamuza
    20: ['Paja'],               // Sombreros: fibra vegetal de paja
};

function materialsForCategory(catId) {
    const banned = bannedMaterials[catId] || [];
    // 1) partimos de los materiales generales menos los prohibidos
    const base = generalMaterials.filter(m => !banned.includes(m));
    // 2) le añadimos, si hubiere, los materiales exclusivos
    const extra = exclusiveMaterials[catId] || [];
    // 3) devolvemos la unión (sin duplicados por si acaso)
    return Array.from(new Set([...base, ...extra]));
}

function randInt(max) { return Math.floor(Math.random() * max); }
function pick(arr) { return arr[randInt(arr.length)]; }
function sample(arr, count) {
    const copy = [...arr];
    const out = [];
    count = Math.min(count, copy.length);
    while (out.length < count) {
        const idx = randInt(copy.length);
        out.push(copy.splice(idx, 1)[0]);
    }
    return out;
}

let prodId = 0;
let promoId = 0;

const promoMeta = {};
const productInfo = {};
const usedSkus = new Set();
const seenPromos = { Categoria: new Set(), Marca: new Set(), Producto: new Set() };

console.log('-- Productos');
categories.forEach(cat => {
    genders.forEach(g => {
        // 1) reglas de género…
        if (femaleCats.includes(cat.id) && !['Mujer', 'Niños'].includes(g)) return;
        // 2) transformar “Niños”→“Niña” si toca
        const displayGender = (g === 'Niños' && femaleCats.includes(cat.id))
            ? 'Niña'
            : g;

        brands.forEach(b => {
            const baseName = cat.singular; // <-- usamos "singular"
            // 3) sólo ponemos "de" cuando NO es Unisex
            const name = (displayGender === 'Unisex')
                ? `${baseName} ${displayGender} ${b.name}`
                : `${baseName} de ${displayGender} ${b.name}`;

            prodId++;
            productInfo[prodId] = {
                catId: cat.id,
                brandId: b.id,
                gender: g,
                name: name
            };
            write(
                `INSERT INTO productos (Nombre,Genero,MarcaId,CategoriaId) ` +
                `VALUES ('${name}','${g}',${b.id},${cat.id});`
            );
        });
    });
});

// 1) Pre-calcular precio fijo por producto, tomando priceRange de la categoría:
const priceMap = {};
Object.entries(productInfo).forEach(([id, info]) => {
    const cat = categories.find(c => c.id === info.catId);
    const [min, max] = cat?.priceRange || [10, 50];
    const precioBase = +(min + Math.random() * (max - min)).toFixed(2);
    priceMap[id] = precioBase;
})

console.log('\n-- Variantes');// 2) Generar variantes usando sku padded y precio uniforme:
Object.entries(productInfo).forEach(([id, info]) => {
    const catMats = materialsForCategory(info.catId);

    const pattern = randInt(5);
    let selSizes, selColors;
    switch (pattern) {
        case 0: selSizes = sizes; selColors = [pick(colors)]; break;
        case 1: selSizes = sizes; selColors = colors; break;
        case 2: selSizes = [pick(sizes)]; selColors = colors; break;
        case 3: selSizes = sizes; selColors = sample(colors, Math.ceil(colors.length / 2)); break;
        case 4: selSizes = sample(sizes, Math.ceil(sizes.length / 2)); selColors = colors; break;
    }

    selSizes.forEach(size => selColors.forEach(col => {
        const idStr = id.toString().padStart(4, '0');
        const colorCode = col.slice(0, 3).toUpperCase();
        const sku = `SKU-P${idStr}-${size}-${colorCode}`;

        if (usedSkus.has(sku)) return;  // o `continue` en lugar de `return` si estás en un forEach

        usedSkus.add(sku);
        const price = priceMap[id];
        const mat = pick(catMats);

        write(
            `INSERT INTO productovariantes ` +
            `(ProductoId,Color,Talla,Material,SKU,PrecioVenta,Cantidad) VALUES ` +
            `(${id},'${col}','${size}','${mat}','${sku}',${price},${randInt(20) + 1});`
        );
    }));
});

// Al generar cada promo:
console.log('\n-- promociones');
Object.entries(productInfo).forEach(([id, info]) => {
    // 1) Tipo + target
    const tipo = pick(['Categoria', 'Marca', 'Producto']);
    const key = tipo === 'Categoria'
        ? info.catId
        : tipo === 'Marca'
            ? info.brandId
            : Number(id);

    // 2) Evitar duplicados
    if (seenPromos[tipo].has(key)) return;
    seenPromos[tipo].add(key);

    // 3) Determinar rango de géneros válidos para este target
    let generoPool;
    if ((tipo === 'Categoria') && femaleCats.includes(key)) {
        generoPool = ['Mujer', 'Niños', 'Unisex'];
    } else {
        generoPool = genders;
    }

    // 4) Elegir género de la promo
    const promoGenero = tipo === 'Producto'
        ? info.gender
        : pick(generoPool);

    // 5) Calcular cobertura
    const cobertura = tipo === 'Producto'
        ? 1.00
        : pick([1, 0.5, 0.25, 0.33]);

    // 6) Preparar sufijo de género (solo para Cat/Marca; Niños→Niña solo en categorías femeninas)
    let displayGenero = promoGenero;
    if (
        tipo === 'Categoria' &&
        promoGenero === 'Niños' &&
        femaleCats.includes(key)
    ) {
        displayGenero = 'Niña';
    }

    // ahora construimos el sufijo de género sólo para Marca/Categoría
    const genderSuffix =
        (promoGenero === 'Unisex' || tipo === 'Producto')
            ? ''
            : ` para ${displayGenero}`;  // <-- aquí usamos displayGenero, no promoGenero

    // 7) Generar resto de datos aleatorios
    const pct = pick(discountOptions);
    const season = pick(seasons);
    const { start, end } = seasonDates[season];

    // 8) Construir título
    let titulo;
    if (tipo === 'Categoria') {
        const catName = categories.find(c => c.id === info.catId).name;
        titulo = `${pick(promoKeywords)} de ${catName}${genderSuffix} -${pct}%`;
    }
    else if (tipo === 'Marca') {
        const brandName = brands.find(b => b.id === info.brandId).name;
        titulo = `${pick(promoKeywords)} de ${season} en ${brandName}${genderSuffix} -${pct}%`;
    }
    else { // Producto
        titulo = `${pick(promoKeywords)} en ${info.name} -${pct}%`;
    }

    // 9) Volcar INSERT
    write(
        `INSERT INTO promociones ` +
        `(Titulo,Descuento,FechaInicio,FechaFin,TipoPromo,TargetId,Cobertura,Genero) VALUES ` +
        `('${titulo}',${pct},'${start}','${end}','${tipo}',${key},${cobertura.toFixed(2)},'${promoGenero}');`
    );

    // 10) Guardar para detalle
    promoId++
    promoMeta[promoId] = { tipo, key, cobertura, genero: promoGenero };
});

console.log('\n-- promocion_productos');
for (let pid = 1; pid <= promoId; pid++) {
    const { tipo, key, cobertura, genero } = promoMeta[pid];

    // Sólo expandimos cuando es categoría o marca
    if (tipo === 'Producto') continue;

    // 1) Productos elegibles según categoría/marca
    let elegibles = Object.entries(productInfo)
        .filter(([_, info]) =>
            (tipo === 'Categoria' && info.catId === key) ||
            (tipo === 'Marca' && info.brandId === key)
        )
        .map(([id, info]) => ({ id: Number(id), genero: info.gender }));

    // 2) Filtrar por género: incluimos sólo los que coinciden o ‘Unisex’
    elegibles = elegibles
        .filter(p => p.genero === genero || p.genero === 'Unisex')
        .map(p => p.id);

    // 3) Elegir X productos según cobertura
    const count = Math.max(1, Math.floor(elegibles.length * cobertura));
    const sel = sample(elegibles, count);

    // 4) Insert detalle
    sel.forEach(prodId => {
        write(
            `INSERT INTO promocionproductos ` +
            `(PromocionId,ProductoId) VALUES ` +
            `(${pid},${prodId});`
        );
    });
}

out.end(() => {
    console.log(`✅ SQL volcado en ${outputPath}`);
});
