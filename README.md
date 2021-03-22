
Simple Sankey provides a web interface to generate Sankey graphs based on
simple inputs. The input is expected to look something like the following:

```text
a: b
c: b
c: d
```

The webapp will prepend "time" in front of these items. In this case, the
generated chart will start with "time", which will split to "a" and "c". The
"a" will then go to "b", half of "c" will also go to "b", and the other half of
"c" will go to "d".

If there was an item with only one level (e.g. just `e`), the webapp will
automatically add an additional level with an asterisk (i.e. making it the
equivalent of `e: e*`).

