# AS12198｜Communities

## Region Code ROUTER_ID:

```
Asia:3x

NRT:33
OSA:34
DZ:37
SGP:32
HKG:31
HKG:35
HKG:36
DZ:37
MCO:38
TPE:39

EU:1x

AMS:11
FRA:12


US:2x

FMT:20
KAS:21
SJC:22

```
## Example:

```
bgp_community.add((12198, 33));

if (12198, 34) ~ bgp_community then bgp_local_pref = 500;

bgp_path.prepend(LOCAL_ASN);


```

## More:











