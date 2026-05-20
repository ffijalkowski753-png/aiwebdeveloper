# Claude templates

Ten folder zawiera szablony, które backend może automatycznie wypełnić danymi z formularza na stronie głównej.

Docelowy przepływ:

1. Klient wypełnia formularz briefu.
2. Backend zapisuje brief w bazie.
3. Backend wybiera szablon z tego folderu.
4. Pola `{{...}}` są podstawiane danymi z formularza.
5. Gotowy prompt trafia do Claude Code albo Claude API.
6. Wynik jest zapisywany jako katalog strony klienta.

Główny szablon:

- `website-demo.prompt.md`

Pomocnicze szablony:

- `sales-summary.prompt.md`
- `wordpress-handoff.prompt.md`
