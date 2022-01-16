# Backend challenge

Para consultas estamos disponibles en [https://comunidad.belo.app](https://comunidad.belo.app)

### Consigna

Teniendo en cuenta los **order books** de Okex, implementar un servicio que:

- Se autentique en Okex
- Estime y ejecute un swap (SPOT) óptimo por volumen de los siguientes pares:
    - USDT ↔ ETH
    - USDT ↔ BTC
    - USDC ↔ AAVE
- Un endpoint para pedir estimación de precio dado un volumen y un par, con una expiración para el precio prometido
- Un endpoint para ejecutar el swap dada la estimación prometida
- Manejos de fees y spread parametrizable

### Requerimientos

- Typescript o Rust
- API Rest o Graphql
- SQL Database, preferentemente postgres (usen el ORM/query builder que más les guste)
- Integration tests

### Docs

[https://www.okex.com/](https://www.okex.com/)

[https://www.okex.com/docs-v5/en/](https://www.okex.com/docs-v5/en/)

### FAQ

*Que es un smart order router?*

Es un proceso automatizado que maneja ordenes de manera eficiente tomando ventaja de las mejores oportunidades disponibles.

*Que es un order book?*

Un order book es una lista digital de pedidos de compra y venta, normalmente utilizados en los mercados financieros.

*Que es un swap?*

Un swap es una conversion o cambio entre 1 o mas activos financieros.

*A qué nos referimos con óptimo?*

Al mejor precio posible que se le pueda ofrecer al consumidor del API.

*Que son los fees?*

Son las comisiones cobradas por el Okex al querer ejecutar una operación de compra o venta. A su vez belo también cobra una comisión operativa la cual debe ser tomada en cuenta.

*Que es el spread?*

Es la diferencia entre el mejor precio de compra y el mejor precio de venta en el order book de cada activo.
