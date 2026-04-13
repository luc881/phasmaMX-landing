export type ArticleCategory =
  | "expedition"
  | "taxonomy"
  | "species-of-month"
  | "outreach"
  | "conservation"
  | "care";

export interface ArticleAuthor {
  name: string;
  role: string;
  initials: string;
}

export interface ArticleBodySection {
  type: "paragraph" | "pull-quote" | "subheading" | "image";
  content: string;
  caption?: string;
  credit?: string;
  src?: string;
}

export interface ArticlePlaceholder {
  id: string;
  slug: string;
  titleEs: string;
  publishedAt: string;
  readingMinutes: number;
  category: ArticleCategory;
  categoryLabel: string;
  excerpt: string;
  image: string;
  imageCaption: string;
  author: ArticleAuthor;
  tags: string[];
  body: ArticleBodySection[];
  relatedSlugs: string[];
}

export const CATEGORY_META: Record<
  ArticleCategory,
  { label: string; color: string; border: string }
> = {
  expedition:        { label: "Expedición",      color: "text-lichen",  border: "border-lichen/40"  },
  taxonomy:          { label: "Taxonomía",        color: "text-gold",    border: "border-gold/40"    },
  "species-of-month":{ label: "Especie del mes",  color: "text-amber",   border: "border-amber/40"   },
  outreach:          { label: "Divulgación",       color: "text-text2",   border: "border-border2"    },
  conservation:      { label: "Conservación",      color: "text-amber",   border: "border-amber/40"   },
  care:              { label: "Terrariofilia",      color: "text-gold",    border: "border-gold/40"    },
};

export const CATEGORIES: { value: string; label: string }[] = [
  { value: "all",             label: "Todos" },
  { value: "expedition",      label: "Expedición" },
  { value: "taxonomy",        label: "Taxonomía" },
  { value: "species-of-month",label: "Especie del mes" },
  { value: "outreach",        label: "Divulgación" },
  { value: "conservation",    label: "Conservación" },
  { value: "care",            label: "Terrariofilia" },
];

export const PLACEHOLDER_ARTICLES: ArticlePlaceholder[] = [
  {
    id: "1",
    slug: "bacteria-ploiaria-veracruz",
    titleEs: "Primeros registros de Bacteria ploiaria en Veracruz",
    publishedAt: "2024-03-15",
    readingMinutes: 8,
    category: "expedition",
    categoryLabel: "Expedición",
    excerpt: "Durante una expedición nocturna en la Sierra de los Tuxtlas, el equipo de Phasma MX documentó por primera vez la presencia de esta especie en territorio mexicano, ampliando el rango de distribución conocido en más de 400 km.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=85&fit=crop",
    imageCaption: "Sotobosque de la Sierra de los Tuxtlas, Veracruz — hábitat del registro.",
    author: { name: "Dr. Martín Vidal", role: "Investigador asociado", initials: "MV" },
    tags: ["Bacteria ploiaria", "Veracruz", "nuevo registro", "Sierra de los Tuxtlas"],
    relatedSlugs: ["taxonomia-phasmatodea-2024", "extatosoma-tiaratum-mimetismo"],
    body: [
      { type: "paragraph", content: "La Sierra de los Tuxtlas, en el sur del estado de Veracruz, alberga uno de los últimos reductos de selva alta perennifolia del Golfo de México. Esta región de extraordinaria biodiversidad ha sido objeto de estudio entomológico intermitente desde la década de 1960, pero sus fásmidos permanecían prácticamente inexplorados hasta hace tres años, cuando el equipo de Phasma MX inició una serie de expediciones nocturnas sistemáticas." },
      { type: "pull-quote", content: "Un hallazgo que amplía el rango de distribución conocido de la especie en más de cuatrocientos kilómetros hacia el norte." },
      { type: "subheading", content: "La expedición de marzo" },
      { type: "paragraph", content: "Durante la noche del 12 al 13 de marzo de 2024, el equipo conformado por cuatro investigadores recorrió transectos preestablecidos en el ejido Ruiz Cortines, a 1,100 metros de altitud. Las condiciones climáticas —temperatura de 19 °C y humedad relativa superior al 85 %— eran ideales para la actividad de fásmidos nocturnos. A las 22:47 horas, la investigadora Sofía Ramírez detectó el primer ejemplar sobre un helecho arbóreo (Cyathea sp.) a 2.3 metros de altura." },
      { type: "paragraph", content: "En total, durante esa noche se documentaron 7 ejemplares: 5 hembras adultas y 2 machos. Los especímenes fueron fotografiados in situ con equipo de macrofotografía y posteriormente liberados. Tres hembras fueron medidas y pesadas antes de su liberación, con longitudes de 87, 91 y 94 mm respectivamente." },
      { type: "image", content: "", src: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&q=85", caption: "Ejemplar hembra de Bacteria ploiaria fotografiado en su hábitat natural, 22:47 hrs.", credit: "© M. Vidal / Phasma MX" },
      { type: "subheading", content: "Verificación taxonómica" },
      { type: "paragraph", content: "La determinación taxonómica fue confirmada mediante comparación con el tipo depositado en el Museo de Historia Natural de Londres y con las fotografías de la especie publicadas por Zompro (2004). Los caracteres diagnósticos utilizados fueron la morfología de las placas subgenitales, la longitud relativa de las antenas y la ornamentación del tegumento torácico." },
      { type: "paragraph", content: "El registro fue comunicado al Dr. Paul Brock (Natural History Museum, Londres), quien confirmó la determinación y lo reportará en la próxima actualización del Phasmida Species File Online. Este hallazgo es el primer registro formal de B. ploiaria para el estado de Veracruz y el más septentrional documentado para México." },
    ],
  },
  {
    id: "2",
    slug: "taxonomia-phasmatodea-2024",
    titleEs: "Taxonomía actualizada de Phasmatodea: nuevas familias y géneros",
    publishedAt: "2024-02-08",
    readingMinutes: 12,
    category: "taxonomy",
    categoryLabel: "Taxonomía",
    excerpt: "La revisión filogenómica publicada en Systematic Entomology reordena 12 géneros y eleva tres subfamilias al rango de familia. Un resumen accesible para biólogos no especialistas en sistemática molecular.",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=85&fit=crop",
    imageCaption: "Vista de colección entomológica con especímenes tipo de Phasmatodea.",
    author: { name: "Lucía Herrera", role: "Editora científica", initials: "LH" },
    tags: ["taxonomía", "filogenómica", "Systematic Entomology", "clasificación"],
    relatedSlugs: ["bacteria-ploiaria-veracruz", "distribucion-fasmidos-mexico"],
    body: [
      { type: "paragraph", content: "La sistemática de Phasmatodea ha sido históricamente problemática. El camuflaje extremo que ha convertido a estos insectos en maestros de la adaptación también ha complicado enormemente su clasificación, al generar caracteres morfológicos convergentes que llevan a agrupaciones artificiales. Un estudio nuevo publicado en enero en Systematic Entomology viene a resolver, al menos parcialmente, esta deuda taxonómica acumulada desde el trabajo fundacional de Redtenbacher (1908)." },
      { type: "pull-quote", content: "La convergencia morfológica ha sido el gran enemigo de la taxonomía de Phasmatodea durante más de un siglo." },
      { type: "subheading", content: "La revisión y sus métodos" },
      { type: "paragraph", content: "El equipo de Buckley, Matos-Maraví y colaboradores analizó 312 marcadores UCE (ultraconserved elements) para 198 especies representando todos los clados conocidos del orden. El resultado es el árbol filogenético más completo hasta la fecha, con un Bootstrap de 99 % en los nodos principales. La datación molecular sitúa la divergencia basal de Phasmatodea en el Jurásico tardío (circa 155 Ma), confirmando hipótesis previas basadas en registros fósiles." },
      { type: "subheading", content: "Los cambios nomenclaturales" },
      { type: "paragraph", content: "Los cambios más relevantes para la fauna mexicana son la elevación de Diapheromerinae al rango de familia (Diapheromeridae stat. rev.) y la reubicación del género Bacteria, que pasa de Pseudophasmatidae a la nueva circunscripción de Diapheromeridae. Esto afecta directamente a B. ploiaria, nuestra especie de interés para el noreste mexicano." },
      { type: "paragraph", content: "En total, 12 géneros resultan en sinonimia, 3 subfamilias se elevan a familia, y se reconocen 2 géneros completamente nuevos para ciencia, ambos procedentes de Nueva Guinea. La lista actualizada de familias reconocidas para el orden asciende a 13, frente a las 10 de la clasificación anterior." },
      { type: "image", content: "", src: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=85", caption: "Árbol filogenético simplificado de Phasmatodea según Buckley et al. 2024.", credit: "© Systematic Entomology / Wiley" },
    ],
  },
  {
    id: "3",
    slug: "extatosoma-tiaratum-mimetismo",
    titleEs: "Especie del mes: Extatosoma tiaratum y su mimetismo mirmecomorfo",
    publishedAt: "2024-01-20",
    readingMinutes: 7,
    category: "species-of-month",
    categoryLabel: "Especie del mes",
    excerpt: "Las ninfas recién eclosionadas de E. tiaratum imitan con asombrosa fidelidad a las hormigas del género Leptomyrmex. Un caso de mimetismo batesiano que tiene implicaciones ecológicas y evolutivas de largo alcance.",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=85&fit=crop",
    imageCaption: "Ninfas de primer estadio de E. tiaratum sobre rama de Eucalyptus.",
    author: { name: "Carlos Mendoza", role: "Biólogo de campo", initials: "CM" },
    tags: ["Extatosoma tiaratum", "mimetismo", "Leptomyrmex", "Australia", "especie del mes"],
    relatedSlugs: ["guia-cria-heteropteryx", "taxonomia-phasmatodea-2024"],
    body: [
      { type: "paragraph", content: "Entre todos los mimetismos descritos en el reino animal, pocos resultan tan perturbadores para el observador humano como el que exhiben las ninfas de primer estadio de Extatosoma tiaratum. A los pocos minutos de eclosionar, estas criaturas de apenas 3 cm se mueven con una agilidad y una morfología que hacen prácticamente imposible distinguirlas de las hormigas Leptomyrmex erythrocephalus que dominan el sotobosque de los eucaliptares del este de Australia." },
      { type: "pull-quote", content: "A los pocos minutos de eclosionar, estas criaturas se mueven con una agilidad y morfología que hace prácticamente imposible distinguirlas de las hormigas." },
      { type: "subheading", content: "El mecanismo del engaño" },
      { type: "paragraph", content: "El mimetismo no es sólo visual. La ninfa mantiene el abdomen enrollado sobre el dorso —una postura completamente atípica para un insecto palo adulto— que replica la forma del gáster de la hormiga. Además, mueve las antenas con la misma frecuencia y patrón que una obrera de Leptomyrmex en estado de alerta. Investigaciones con sensores de aceleración han demostrado que la frecuencia de movimiento antenal es estadísticamente indistinguible entre la ninfa y la hormiga." },
      { type: "paragraph", content: "Esta ilusión multisensorial le garantiza un periodo de gracia de hasta tres días mientras su exoesqueleto endurece y puede comenzar a alimentarse. Después, gradualmente, la ninfa pierde la coloración roja y el comportamiento errático de hormiga, adoptando la postura críptica horizontal sobre ramas que caracteriza a los adultos de la especie." },
      { type: "image", content: "", src: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&q=85", caption: "Hembra adulta de E. tiaratum con abdomen enrollado en postura defensiva.", credit: "© C. Mendoza / Phasma MX" },
      { type: "subheading", content: "El elaiosoma: la otra cara del engaño" },
      { type: "paragraph", content: "Pero la relación con las hormigas no termina en el mimetismo de las ninfas. Los huevos de E. tiaratum poseen una estructura grasa llamada elaiosoma —análoga a la que se encuentra en las semillas de violeta o acacia— que las hormigas recogen y transportan a sus nidos. Una vez allí, el huevo permanece en el ambiente controlado del hormiguero hasta eclosionar, cuando la ninfa, armada de su camuflaje, escapa por las galerías." },
    ],
  },
  {
    id: "4",
    slug: "guia-cria-heteropteryx",
    titleEs: "Guía de cría: Heteropteryx dilatata para principiantes",
    publishedAt: "2024-01-05",
    readingMinutes: 10,
    category: "care",
    categoryLabel: "Terrariofilia",
    excerpt: "Una de las especies más demandadas en terrariofilia por su tamaño imponente y dimorfismo sexual extremo. Todo lo que debes saber sobre instalación, alimentación, manejo e incubación antes de adquirir un ejemplar.",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=85&fit=crop",
    imageCaption: "Hembra adulta de Heteropteryx dilatata sobre rama de Psidium guajava.",
    author: { name: "Sofía Ramírez", role: "Especialista en terrariofilia", initials: "SR" },
    tags: ["Heteropteryx dilatata", "cría", "terrariofilia", "principiantes", "guía"],
    relatedSlugs: ["extatosoma-tiaratum-mimetismo", "ecologia-fasmidos-bosques"],
    body: [
      { type: "paragraph", content: "Heteropteryx dilatata, la 'ninfa de la jungla malaya', es probablemente la especie de insecto palo más impresionante disponible en terrariofilia. Las hembras adultas pueden superar los 160 mm de longitud y 65 g de peso, convirtiéndola en la especie más pesada del orden. Su dimorfismo sexual es extremo: las hembras son verdes, corpulentas y cubiertas de espinas amarillas; los machos son marrones, esbeltos y activos." },
      { type: "pull-quote", content: "Las hembras adultas pueden superar los 160 mm de longitud y 65 g de peso — la especie de insecto palo más pesada del mundo." },
      { type: "subheading", content: "El terrario: espacio y condiciones" },
      { type: "paragraph", content: "El principal error que cometen los principiantes con H. dilatata es subestimar el espacio necesario. Una hembra adulta requiere un terrario de al menos 40 × 40 × 80 cm (ancho × fondo × alto). El material debe ser malla metálica o de nylon fino —el vidrio o plástico sin ventilación lateral genera condensación excesiva que favorece infecciones bacterianas. La temperatura óptima es 24–28 °C durante el día, pudiendo bajar a 20 °C por la noche." },
      { type: "paragraph", content: "La humedad relativa debe mantenerse entre el 70 y el 80 %. Se consigue fácilmente pulverizando las paredes del terrario una vez al día por la tarde. Es fundamental no pulverizar directamente sobre el animal ni dejar agua estancada en el fondo, lo que podría provocar infecciones respiratorias." },
      { type: "subheading", content: "Alimentación: la planta clave" },
      { type: "paragraph", content: "Heteropteryx dilatata acepta un rango moderado de plantas hospederas en cautiverio: guayaba (Psidium guajava), zarza (Rubus), encino (Quercus) y mango (Mangifera indica). Sin embargo, la guayaba es claramente la planta preferida —los ejemplares alimentados exclusivamente con guayaba muestran mejor coloración, menor mortalidad y mayor tasa de oviposición." },
      { type: "image", content: "", src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=85", caption: "Detalle de la espina femoral de macho adulto de H. dilatata.", credit: "© S. Ramírez / Phasma MX" },
      { type: "subheading", content: "Los huevos: la prueba de paciencia" },
      { type: "paragraph", content: "Los huevos de H. dilatata son los más grandes del orden, midiendo entre 10 y 12 mm. Las hembras los entierran individualmente en el sustrato, por lo que el terrario debe tener una capa de mínimo 10 cm de sustrato compuesto por tierra vegetal y vermiculita en proporción 2:1. El período de incubación es extraordinariamente largo: entre 9 y 18 meses a 26–28 °C. La paciencia es la virtud más importante del criador de esta especie." },
    ],
  },
  {
    id: "5",
    slug: "distribucion-fasmidos-mexico",
    titleEs: "Distribución de Phasmatodea en México: estado del conocimiento",
    publishedAt: "2023-11-30",
    readingMinutes: 15,
    category: "conservation",
    categoryLabel: "Conservación",
    excerpt: "Revisamos el estado actual del conocimiento sobre la diversidad y distribución de fásmidos en México. Con más de 120 especies registradas, el país es uno de los centros de diversidad del orden, pero el 60 % de los estados siguen sin colectas sistemáticas.",
    image: "https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&q=85&fit=crop",
    imageCaption: "Bosque mesófilo de montaña en Oaxaca — uno de los hábitats de mayor riqueza de fásmidos en México.",
    author: { name: "Dr. Martín Vidal", role: "Investigador asociado", initials: "MV" },
    tags: ["México", "distribución", "diversidad", "colectas", "biogeografía"],
    relatedSlugs: ["bacteria-ploiaria-veracruz", "taxonomia-phasmatodea-2024"],
    body: [
      { type: "paragraph", content: "México ocupa una posición biogeográfica privilegiada en la intersección de las regiones Neártica y Neotropical, lo que se traduce en una biodiversidad excepcional para prácticamente todos los grupos de organismos. Los Phasmatodea no son la excepción: con 127 especies formalmente descritas hasta diciembre de 2023 (Phasmida Species File, vers. 6.1), el país se sitúa entre los cinco primeros en riqueza de fásmidos a nivel mundial." },
      { type: "pull-quote", content: "El 60 % de los estados mexicanos carecen de cualquier registro sistemático de fásmidos — uno de los vacíos más grandes en el conocimiento entomológico del país." },
      { type: "subheading", content: "Dónde están los registros" },
      { type: "paragraph", content: "El análisis espacial de los 1,847 registros georreferenciados disponibles en GBIF, Naturalista y las bases de datos de museos mexicanos revela una distribución extremadamente sesgada. El 78 % de los registros provienen de sólo cuatro estados: Chiapas (n = 412), Veracruz (n = 387), Oaxaca (n = 298) y Guerrero (n = 244). Nueve estados —Baja California, Baja California Sur, Sonora parcialmente, Colima, Aguascalientes, Tlaxcala, Ciudad de México, Querétaro y Morelos— no tienen ningún registro formal publicado." },
      { type: "subheading", content: "El vacío norteño" },
      { type: "paragraph", content: "Particularmente notable es la ausencia de colectas en los estados del norte-centro del país. Si bien la aridez creciente hacia el norte reduce la riqueza esperada, los bosques de pino-encino de la Sierra Madre Occidental y Oriental seguramente albergan poblaciones de Diapheromera, Parabacillus y otros géneros presentes en el suroeste de los Estados Unidos cuya distribución en México es desconocida." },
    ],
  },
  {
    id: "6",
    slug: "ecologia-fasmidos-bosques",
    titleEs: "El papel ecológico de los fásmidos en los bosques tropicales",
    publishedAt: "2023-10-12",
    readingMinutes: 9,
    category: "outreach",
    categoryLabel: "Divulgación",
    excerpt: "Más allá de su fascinante camuflaje, los insectos palo desempeñan roles ecológicos concretos como herbívoros, presas y dispersores de semillas. Una revisión de la evidencia científica disponible.",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=85&fit=crop",
    imageCaption: "Dosel de bosque tropical en Chiapas — hábitat principal de fásmidos mexicanos.",
    author: { name: "Lucía Herrera", role: "Editora científica", initials: "LH" },
    tags: ["ecología", "bosque tropical", "herbívoros", "cadena trófica", "divulgación"],
    relatedSlugs: ["distribucion-fasmidos-mexico", "extatosoma-tiaratum-mimetismo"],
    body: [
      { type: "paragraph", content: "Los fásmidos son frecuentemente descritos por sus extraordinarias capacidades de camuflaje, pero esta narrativa —aunque cierta y maravillosa— tiende a eclipsar su importancia como actores ecológicos en los ecosistemas forestales que habitan. La investigación acumulada en las últimas dos décadas nos permite esbozar un cuadro más completo de su papel funcional." },
      { type: "pull-quote", content: "En años de alta densidad, algunas especies son capaces de consumir entre el 15 y el 25 % de la producción foliar local de sus plantas hospederas preferidas." },
      { type: "subheading", content: "Herbívoros de nicho" },
      { type: "paragraph", content: "Los fásmidos son herbívoros foliares, pero su impacto en la vegetación varía enormemente según la densidad poblacional. En condiciones normales, actúan como herbívoros de baja intensidad cuyo impacto es difícilmente medible. Sin embargo, en años de alta densidad —fenómeno registrado principalmente en Diapheromera femorata en Norteamérica y en Sipyloidea sipylus en el Sudeste Asiático— son capaces de consumir entre el 15 y el 25 % de la producción foliar local de sus plantas hospederas preferidas." },
      { type: "subheading", content: "Dispersores de semillas y la relación con las hormigas" },
      { type: "paragraph", content: "Como documentó el trabajo de Hughes & Westoby (1992) sobre Extatosoma tiaratum, varios géneros de Phasmatodea producen huevos con elaiosomas —estructuras lipídicas que atraen a las hormigas— favoreciendo así la dispersión y el enterramiento de los huevos. Esta relación mutualista, convergente con la mirmecocoria de muchas plantas, añade una dimensión inesperada al papel ecológico del grupo." },
    ],
  },
  {
    id: "7",
    slug: "phasmida-species-file-guia",
    titleEs: "Cómo usar el Phasmida Species File para investigación",
    publishedAt: "2023-09-04",
    readingMinutes: 6,
    category: "outreach",
    categoryLabel: "Divulgación",
    excerpt: "El Phasmida Species File Online es la base de datos taxonómica de referencia para el orden. Esta guía práctica explica cómo navegar sus recursos, interpretar la nomenclatura y citar correctamente la fuente.",
    image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1200&q=85&fit=crop",
    imageCaption: "Pantalla de consulta del Phasmida Species File versión 6.1.",
    author: { name: "Carlos Mendoza", role: "Biólogo de campo", initials: "CM" },
    tags: ["Phasmida Species File", "base de datos", "nomenclatura", "guía", "recursos"],
    relatedSlugs: ["taxonomia-phasmatodea-2024", "distribucion-fasmidos-mexico"],
    body: [
      { type: "paragraph", content: "El Phasmida Species File Online (PSF, https://phasmida.speciesfile.org) es mantenido por el Dr. Paul Brock desde el Natural History Museum de Londres y actualizado colaborativamente por taxónomos de todo el mundo. A diciembre de 2023 registra 3,517 especies válidas y 568 subespecies distribuidas en 545 géneros. Es la fuente de referencia obligada para cualquier trabajo sobre taxonomía, distribución o nomenclatura del orden." },
      { type: "subheading", content: "Estructura de los registros" },
      { type: "paragraph", content: "Cada ficha de especie en el PSF incluye: nombre válido con autoridad y año, sinonimias completas, localidad tipo, tipo depositario, distribución geográfica, plantas hospederas reportadas, referencias bibliográficas clave y, cuando disponibles, imágenes de tipos o especímenes representativos. La navegación puede hacerse por nombre científico, género, familia o distribución geográfica." },
      { type: "pull-quote", content: "Citar correctamente el PSF no es opcional — es parte de las buenas prácticas de la nomenclatura zoológica moderna." },
      { type: "subheading", content: "Cómo citar" },
      { type: "paragraph", content: "La forma correcta de citar el PSF es: Brock, P.D. et al. (2023). Phasmida Species File Online. Version 6.1. Consultado el [fecha]. http://phasmida.SpeciesFile.org. Es importante incluir la fecha de consulta dado que el registro se actualiza con publicaciones nuevas de forma continua." },
    ],
  },
  {
    id: "8",
    slug: "fotoperiodo-cria-phasmatodea",
    titleEs: "Efecto del fotoperiodo en la cría de fásmidos de clima templado",
    publishedAt: "2023-08-18",
    readingMinutes: 11,
    category: "care",
    categoryLabel: "Terrariofilia",
    excerpt: "Las especies originarias de zonas templadas requieren variación de luz y temperatura para completar su ciclo de vida. Explicamos los mecanismos de diapausa y cómo replicarlos en terrariofilia con equipo básico.",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=85&fit=crop",
    imageCaption: "Terrario con control de temperatura y fotoperiodo para Diapheromera velii.",
    author: { name: "Sofía Ramírez", role: "Especialista en terrariofilia", initials: "SR" },
    tags: ["fotoperiodo", "diapausa", "cría", "clima templado", "Bacillus", "Diapheromera"],
    relatedSlugs: ["guia-cria-heteropteryx", "phasmida-species-file-guia"],
    body: [
      { type: "paragraph", content: "Una de las principales causas de fracaso en la cría de fásmidos de zonas templadas —Bacillus rossius, Diapheromera velii, Clonopsis gallica— es no respetar su ciclo de diapausa. Estas especies han evolucionado en entornos con marcada estacionalidad: veranos cálidos y activos, inviernos fríos con actividad reducida o nula. Sus huevos requieren un periodo de frío obligatorio (diapausa invernal) para desarrollarse y eclosionar en primavera." },
      { type: "pull-quote", content: "Sin diapausa, los huevos de especies templadas no eclosionan. El frío no es un riesgo — es un requisito biológico." },
      { type: "subheading", content: "El mecanismo de la diapausa" },
      { type: "paragraph", content: "La diapausa en huevos de fásmidos templados es una pausa del desarrollo embrionario inducida por temperaturas bajas. Los umbrales varían por especie: Bacillus rossius requiere 2–3 meses a 8–12 °C, mientras que Diapheromera femorata necesita hasta 4 meses a 4–8 °C. Durante este periodo, el metabolismo del embrión se reduce drásticamente y el huevo es resistente a la desecación moderada." },
      { type: "paragraph", content: "Para replicar la diapausa en casa, la opción más sencilla es colocar los huevos en una caja de plástico con vermiculita ligeramente humedecida y dejarlos en el cajón de verduras del frigorífico durante el periodo indicado. No es necesario ningún equipo especializado. Al final de la diapausa, la caja se saca a temperatura ambiente (18–22 °C) y la eclosión comienza en 2–6 semanas." },
    ],
  },
  {
    id: "9",
    slug: "sipyloidea-sipylus-startle",
    titleEs: "Alas rosas, depredadores sorprendidos: el flash display de Sipyloidea sipylus",
    publishedAt: "2023-07-03",
    readingMinutes: 6,
    category: "species-of-month",
    categoryLabel: "Especie del mes",
    excerpt: "Cuando está inmóvil sobre una rama, Sipyloidea sipylus es perfectamente invisible. Cuando es perturbada, despliega alas posteriores de un rosa intenso que sorprende a cualquier depredador. Un análisis del 'deimatic display' en Phasmatodea.",
    image: "https://images.unsplash.com/photo-1560719887-fe3105fa1e55?w=1200&q=85&fit=crop",
    imageCaption: "Hembra adulta de Sipyloidea sipylus con alas posteriores desplegadas.",
    author: { name: "Carlos Mendoza", role: "Biólogo de campo", initials: "CM" },
    tags: ["Sipyloidea sipylus", "flash display", "comportamiento defensivo", "alas rosas", "especie del mes"],
    relatedSlugs: ["extatosoma-tiaratum-mimetismo", "ecologia-fasmidos-bosques"],
    body: [
      { type: "paragraph", content: "El término inglés 'startle display' —o, más técnicamente, deimatic display— describe un comportamiento defensivo en el que un animal críptico revela súbitamente un patrón visual conspicuo para aturdir o intimidar a un depredador. Este comportamiento, descrito en ranas, mantis, polillas y mariposas, tiene en Sipyloidea sipylus uno de sus ejemplos más elegantes entre los insectos palo." },
      { type: "pull-quote", content: "En menos de 200 milisegundos, un palo marrón invisible se convierte en un destello rosa imposible de ignorar." },
      { type: "subheading", content: "El mecanismo del flash" },
      { type: "paragraph", content: "En reposo, S. sipylus mantiene las alas anteriores apretadas sobre el cuerpo, ocultando completamente las alas posteriores de color rosa. Cuando un depredador —generalmente un ave insectívora— se aproxima demasiado, el insecto abre bruscamente las alas en menos de 200 milisegundos. El destello de color en contraste con el entorno críptico provoca una respuesta de sobresalto en el depredador que, en la mayoría de los casos, le da al insecto tiempo para posarse en otro punto de la vegetación y volver al camuflaje." },
    ],
  },
  {
    id: "10",
    slug: "conservacion-phasmatodea-lista-roja",
    titleEs: "Fásmidos en la Lista Roja de la UICN: qué sabemos y qué falta",
    publishedAt: "2023-05-22",
    readingMinutes: 13,
    category: "conservation",
    categoryLabel: "Conservación",
    excerpt: "De las más de 3,500 especies de Phasmatodea descritas, sólo 36 han sido evaluadas formalmente por la UICN. La falta de información básica sobre distribución y ecología es el principal obstáculo para la conservación del grupo.",
    image: "https://images.unsplash.com/photo-1510784722466-f2aa240af4cf?w=1200&q=85&fit=crop",
    imageCaption: "Bosque montano en riesgo de deforestación en Oaxaca — hábitat de fásmidos endémicos.",
    author: { name: "Dr. Martín Vidal", role: "Investigador asociado", initials: "MV" },
    tags: ["UICN", "Lista Roja", "conservación", "amenazas", "deforestación"],
    relatedSlugs: ["distribucion-fasmidos-mexico", "ecologia-fasmidos-bosques"],
    body: [
      { type: "paragraph", content: "La Lista Roja de Especies Amenazadas de la UICN es el estándar global de referencia para la evaluación del estado de conservación de las especies. Sin embargo, para la mayoría de los grupos de invertebrados —incluyendo Phasmatodea— la cobertura es alarmantemente baja. A enero de 2024, sólo 36 especies del orden han sido evaluadas formalmente, representando menos del 1 % de la diversidad conocida." },
      { type: "pull-quote", content: "Menos del 1 % de las especies de Phasmatodea conocidas han sido evaluadas por la UICN. Lo que no se conoce, difícilmente puede protegerse." },
      { type: "subheading", content: "Amenazas principales" },
      { type: "paragraph", content: "Para las especies insulares y de distribución restringida, la pérdida de hábitat es con diferencia la amenaza más grave. El caso más dramático es el del Dryococelus australis de la isla Ball's Pyramid (Australia), considerado extinto durante décadas hasta su redescubrimiento en 2001. Este ejemplo ilustra tanto la resiliencia de algunos fásmidos como la rapidez con que una especie puede desaparecer sin que nadie lo note." },
      { type: "paragraph", content: "En México, las mayores preocupaciones se concentran en las especies endémicas de los bosques mesófilos de montaña, ecosistema que ha perdido más del 60 % de su extensión original y que alberga la mayor concentración de fásmidos endémicos del país. La identificación y descripción de estas especies debe ser paralela a los esfuerzos de conservación de sus hábitats." },
    ],
  },
];

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
