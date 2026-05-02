# AS12198｜Communities

## Region Code ROUTER_ID:

```bash
Asia:3x

NRT:33
NRT:40
OSA:34
---
SGP:32
---
HKG:31
HKG:35
HKG:36
6ff9.76r:37
CGO:371
MCO:38
---
TPE:39
----
EU:1x
AMS:11
FRA:12
----
US:2x
FMT:20
KAS:21
SJC:22

```
## Example:

```yaml
bgp_community.add((12198, 33));

if (12198, 34) ~ bgp_community then bgp_local_pref = 500;

bgp_path.prepend(LOCAL_ASN);

bgp_large_community.add((LOCAL_ASN, ROUTER_ID, LOCAL_ASN));

```

## More:











