Fixes #

<!--
Si el PR no cierra un issue, borra la línea de arriba y describe el cambio.
Las comprobaciones son para traducciones; si tocas tooling o configuración,
bórralas también.
-->

## Comprobaciones

- [ ] `.md` y `.en.md` van en el **mismo commit**
- [ ] Los prefijos de alerta (`NOTE:`, `TIP:`, `IMPORTANT:`, `HELPFUL:`…) siguen en inglés
- [ ] `npm run lint-glossary -- <ruta>` no reporta problemas en lo que toqué
- [ ] `npm run check-translations` ya no lista estos archivos como pendientes

<!--
Por qué estas cuatro y no más:

1. Separar .md y .en.md deja el archivo marcado como desactualizado de forma
   permanente: la detección busca el commit donde se tocaron ambos.
2. Los prefijos de alerta son claves del tokenizer de adev, no prosa. Traducirlos
   hace que el aviso se renderice como párrafo plano. Hay 425 así en el repo.
3. y 4. son los dos comandos de la guía: https://github.com/angular-hispano/angular-docs-es/blob/main/CONTRIBUTING.md#antes-del-pr
-->

### Notas

<!-- Opcional: dudas de terminología, decisiones que quieras que se revisen. -->
