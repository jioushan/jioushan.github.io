import{_ as n,c as s,ag as e,o as p}from"./chunks/framework.-a8jReyC.js";const m=JSON.parse('{"title":"AS12198｜Communities","description":"","frontmatter":{},"headers":[],"relativePath":"Communities/index.md","filePath":"Communities/index.md"}'),o={name:"Communities/index.md"};function t(i,a,l,c,r,d){return p(),s("div",null,a[0]||(a[0]=[e(`<h1 id="as12198-communities" tabindex="-1">AS12198｜Communities <a class="header-anchor" href="#as12198-communities" aria-label="Permalink to &quot;AS12198｜Communities&quot;">​</a></h1><h2 id="control-community" tabindex="-1">Control Community: <a class="header-anchor" href="#control-community" aria-label="Permalink to &quot;Control Community:&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Actions:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  * = 0   do not announce to target</span></span>
<span class="line"><span>  * = 1   prepend 1 to target</span></span>
<span class="line"><span>  * = 2   prepend 2 to target</span></span>
<span class="line"><span>  * = 4   prepend 4 to target</span></span>
<span class="line"><span>  * = 8   prepend 8 to target</span></span>
<span class="line"><span>    Action target selector:</span></span>
<span class="line"><span>  * = Action</span></span>
<span class="line"><span>    (12198, 1*00, 0)            Do action to everyone</span></span>
<span class="line"><span>      (12198, 1*01, asn)          Don&#39;t do action to this asn</span></span>
<span class="line"><span>      (12198, 1*02, asn)          Do action to this asn</span></span>
<span class="line"><span>      (12198, 1*10, 0)            Do action to every region</span></span>
<span class="line"><span>      (12198, 1*11, region_code)  Don&#39;t do action to this region</span></span>
<span class="line"><span>      (12198, 1*12, region_code)  Do action to this region</span></span>
<span class="line"><span>      (12198, 1019, 0)            Disable (asn, 1010, 0),  (asn, 1011, local_region) as default value</span></span>
<span class="line"><span>      (12198, 1*20, 0)            Do action to every country</span></span>
<span class="line"><span>      (12198, 1*21, country_code) Don&#39;t do action to this country</span></span>
<span class="line"><span>      (12198, 1*22, country_code) Do action to this country</span></span>
<span class="line"><span>      (12198, 1*30, 1)            Do action to upstreams</span></span>
<span class="line"><span>      (12198, 1*30, 2)            Do action to ixp rs</span></span>
<span class="line"><span>      (12198, 1*30, 3)            Do action to peers</span></span>
<span class="line"><span>      (12198, 1*30, 4)            Do action to downstreams</span></span>
<span class="line"><span>      (12198, 1*30, 8)            Do action to route collectors</span></span></code></pre></div><h2 id="region-code" tabindex="-1">Region code: <a class="header-anchor" href="#region-code" aria-label="Permalink to &quot;Region code:&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>* 41: Europe</span></span>
<span class="line"><span>* 44: North America-W</span></span>
<span class="line"><span>* 45: Central America</span></span>
<span class="line"><span>* 51: Asia-SE (TH, SG, PH, ID, MY)</span></span>
<span class="line"><span>* 52: Asia-E (HK,CN)</span></span>
<span class="line"><span>* 58: ASIA_TW (TW,)</span></span>
<span class="line"><span>* 59: Asia-SGP (SG,)</span></span>
<span class="line"><span>* 60: Asia-JP (JP,)</span></span></code></pre></div><h2 id="example" tabindex="-1">Example: <a class="header-anchor" href="#example" aria-label="Permalink to &quot;Example:&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bgp_large_community.add((199605, 1019, 0));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#You will export upstream from our main cross-region location</span></span></code></pre></div><h2 id="more" tabindex="-1">More: <a class="header-anchor" href="#more" aria-label="Permalink to &quot;More:&quot;">​</a></h2><h3 id="country-code" tabindex="-1">Country code: <a class="header-anchor" href="#country-code" aria-label="Permalink to &quot;Country code:&quot;">​</a></h3><p>ISO-3166 numeric-3 country code</p>`,10)]))}const h=n(o,[["render",t]]);export{m as __pageData,h as default};
