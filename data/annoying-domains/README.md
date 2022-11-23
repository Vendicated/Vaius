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
