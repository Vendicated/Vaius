### sxcu

Go to <https://sxcu.net/domains.php?ipp=200>

For each page, run

```js
copy(
  [...document.querySelectorAll("td:has(.badge)")]
    .map((e) => e.innerText.split(" ")[1])
    .join("\n")
);
```

### encrypting.host

```js
copy(
  $$("div:has([name='domains']) li")
    .map(l => l.textContent.split(" ").shift().replace("*.", ""))
    .filter(d => d.includes("."))
    .join("\n")
)
```
