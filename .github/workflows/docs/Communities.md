# AS199605｜Communities

## Control Community:

```
Actions:

  * = 0   do not announce to target
  * = 1   prepend 1 to target
  * = 2   prepend 2 to target
  * = 4   prepend 4 to target
  * = 8   prepend 8 to target
    Action target selector:
  * = Action
    (199605, 1*00, 0)            Do action to everyone
      (199605, 1*01, asn)          Don't do action to this asn
      (199605, 1*02, asn)          Do action to this asn
      (199605, 1*10, 0)            Do action to every region
      (199605, 1*11, region_code)  Don't do action to this region
      (199605, 1*12, region_code)  Do action to this region
      (199605, 1019, 0)            Disable (asn, 1010, 0),  (asn, 1011, local_region) as default value
      (199605, 1*20, 0)            Do action to every country
      (199605, 1*21, country_code) Don't do action to this country
      (199605, 1*22, country_code) Do action to this country
      (199605, 1*30, 1)            Do action to upstreams
      (199605, 1*30, 2)            Do action to ixp rs
      (199605, 1*30, 3)            Do action to peers
      (199605, 1*30, 4)            Do action to downstreams
      (199605, 1*30, 8)            Do action to route collectors

```
## Region code:

```
* 41: Europe
* 44: North America-W
* 45: Central America
* 51: Asia-SE (TH, SG, PH, ID, MY)
* 52: Asia-E (JP, KR, TW, HK,)
```

example:

```
bgp_large_community.add((199605, 1019, 0));
#You will export upstream from our main cross-region location
```



## More:

### Country code:

ISO-3166 numeric-3 country code









