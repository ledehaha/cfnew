    // CFnew - 终端 v2.9.6
    // 版本: v2.9.6 
    import { connect } from 'cloudflare:sockets';
    let at = '351c9981-04b6-4103-aa4b-864aa9c91469';
    let fallbackAddress = '';
    let socks5Config = '';
    let customPreferredIPs = [];
    let customPreferredDomains = [];
    let enableSocksDowngrade = false;
    let disableNonTLS = false;
    let disablePreferred = false;
    let enableRegionMatching = true;
    let currentWorkerRegion = '';
    let manualWorkerRegion = '';
    let piu = '';
    let cp = '';  

    let ev = true;   
    let et = false; 
    let ex = false;  
    let tp = '';
    // 启用ECH功能（true启用，false禁用）
    let enableECH = false;  
    // 自定义DNS服务器（默认：https://223.5.5.5/dns-query）
    let customDNS = 'https://223.5.5.5/dns-query';
    // 自定义ECH域名（默认：cloudflare-ech.com）
    let customECHDomain = 'cloudflare-ech.com';

    let scu = 'https://url.v1.mk/sub';  
    // 远程配置URL（硬编码）
    const remoteConfigUrl = 'https://raw.githubusercontent.com/byJoey/test/refs/heads/main/tist.ini';

    let epd = false;   // 优选域名默认关闭
    let epi = true;       
    let egi = false;
    let ena = false;   // 原生地址默认关闭          

    let kvStore = null;
    let kvConfig = {};
    let kvConfigLastLoad = 0;
    const KV_CACHE_TTL = 5 * 60 * 60 * 1000; // 5小时缓存

    const regionMapping = {
        'HK': ['🇭🇰 香港', 'HK', 'Hong Kong'],
        'US': ['🇺🇸 美国', 'US', 'United States'],
        'SG': ['🇸🇬 新加坡', 'SG', 'Singapore'],
        'JP': ['🇯🇵 日本', 'JP', 'Japan'],
        'KR': ['🇰🇷 韩国', 'KR', 'South Korea'],
        'DE': ['🇩🇪 德国', 'DE', 'Germany'],
        'SE': ['🇸🇪 瑞典', 'SE', 'Sweden'],
        'NL': ['🇳🇱 荷兰', 'NL', 'Netherlands'],
        'FI': ['🇫🇮 芬兰', 'FI', 'Finland'],
        'GB': ['🇬🇧 英国', 'GB', 'United Kingdom'],
        'Oracle': ['甲骨文', 'Oracle'],
        'DigitalOcean': ['数码海', 'DigitalOcean'],
        'Vultr': ['Vultr', 'Vultr'],
        'Multacom': ['Multacom', 'Multacom']
    };

    let backupIPs = [
        { domain: 'ProxyIP.HK.CMLiussss.net', region: 'HK', regionCode: 'HK', port: 443 },
        { domain: 'ProxyIP.US.CMLiussss.net', region: 'US', regionCode: 'US', port: 443 },
        { domain: 'ProxyIP.SG.CMLiussss.net', region: 'SG', regionCode: 'SG', port: 443 },
        { domain: 'ProxyIP.JP.CMLiussss.net', region: 'JP', regionCode: 'JP', port: 443 },
        { domain: 'ProxyIP.KR.CMLiussss.net', region: 'KR', regionCode: 'KR', port: 443 },
        { domain: 'ProxyIP.DE.CMLiussss.net', region: 'DE', regionCode: 'DE', port: 443 },
        { domain: 'ProxyIP.SE.CMLiussss.net', region: 'SE', regionCode: 'SE', port: 443 },
        { domain: 'ProxyIP.NL.CMLiussss.net', region: 'NL', regionCode: 'NL', port: 443 },
        { domain: 'ProxyIP.FI.CMLiussss.net', region: 'FI', regionCode: 'FI', port: 443 },
        { domain: 'ProxyIP.GB.CMLiussss.net', region: 'GB', regionCode: 'GB', port: 443 },
        { domain: 'ProxyIP.Oracle.cmliussss.net', region: 'Oracle', regionCode: 'Oracle', port: 443 },
        { domain: 'ProxyIP.DigitalOcean.CMLiussss.net', region: 'DigitalOcean', regionCode: 'DigitalOcean', port: 443 },
        { domain: 'ProxyIP.Vultr.CMLiussss.net', region: 'Vultr', regionCode: 'Vultr', port: 443 },
        { domain: 'ProxyIP.Multacom.CMLiussss.net', region: 'Multacom', regionCode: 'Multacom', port: 443 }
    ];

    const directDomains = [
        { name: "cloudflare.182682.xyz", domain: "cloudflare.182682.xyz" }, { name: "speed.marisalnc.com", domain: "speed.marisalnc.com" },
        { domain: "freeyx.cloudflare88.eu.org" }, { domain: "bestcf.top" }, { domain: "cdn.2020111.xyz" }, { domain: "cfip.cfcdn.vip" },
        { domain: "cf.0sm.com" }, { domain: "cf.090227.xyz" }, { domain: "cf.zhetengsha.eu.org" }, { domain: "cloudflare.9jy.cc" },
        { domain: "cf.zerone-cdn.pp.ua" }, { domain: "cfip.1323123.xyz" }, { domain: "cnamefuckxxs.yuchen.icu" }, { domain: "cloudflare-ip.mofashi.ltd" },
        { domain: "115155.xyz" }, { domain: "cname.xirancdn.us" }, { domain: "f3058171cad.002404.xyz" }, { domain: "8.889288.xyz" },
        { domain: "cdn.tzpro.xyz" }, { domain: "cf.877771.xyz" }, { domain: "xn--b6gac.eu.org" }
    ];

    const E_INVALID_DATA = atob('aW52YWxpZCBkYXRh');
    const E_INVALID_USER = atob('aW52YWxpZCB1c2Vy');
    const E_UNSUPPORTED_CMD = atob('Y29tbWFuZCBpcyBub3Qgc3VwcG9ydGVk');
    const E_UDP_DNS_ONLY = atob('VURQIHByb3h5IG9ubHkgZW5hYmxlIGZvciBETlMgd2hpY2ggaXMgcG9ydCA1Mw==');
    const E_INVALID_ADDR_TYPE = atob('aW52YWxpZCBhZGRyZXNzVHlwZQ==');
    const E_EMPTY_ADDR = atob('YWRkcmVzc1ZhbHVlIGlzIGVtcHR5');
    const E_WS_NOT_OPEN = atob('d2ViU29ja2V0LmVhZHlTdGF0ZSBpcyBub3Qgb3Blbg==');
    const E_INVALID_ID_STR = atob('U3RyaW5naWZpZWQgaWRlbnRpZmllciBpcyBpbnZhbGlk');
    const E_INVALID_SOCKS_ADDR = atob('SW52YWxpZCBTT0NLUyBhZGRyZXNzIGZvcm1hdA==');
    const E_SOCKS_NO_METHOD = atob('bm8gYWNjZXB0YWJsZSBtZXRob2Rz');
    const E_SOCKS_AUTH_NEEDED = atob('c29ja3Mgc2VydmVyIG5lZWRzIGF1dGg=');
    const E_SOCKS_AUTH_FAIL = atob('ZmFpbCB0byBhdXRoIHNvY2tzIHNlcnZlcg==');
    const E_SOCKS_CONN_FAIL = atob('ZmFpbCB0byBvcGVuIHNvY2tzIGNvbm5lY3Rpb24=');

    let parsedSocks5Config = {};
    let isSocksEnabled = false;

    const ADDRESS_TYPE_IPV4 = 1;
    const ADDRESS_TYPE_URL = 2;
    const ADDRESS_TYPE_IPV6 = 3;

	function isValidFormat(str) {
        const userRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return userRegex.test(str);
    }

    function isValidIP(ip) {
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (ipv4Regex.test(ip)) return true;

        const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        if (ipv6Regex.test(ip)) return true;

        const ipv6ShortRegex = /^::1$|^::$|^(?:[0-9a-fA-F]{1,4}:)*::(?:[0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}$/;
        if (ipv6ShortRegex.test(ip)) return true;

        return false;
    }

    function createNodeNamer(skip = false) {
        // 如果配置了 yxURL，则跳过编号
        const forceSkip = (typeof piu !== 'undefined' && piu && piu.trim());
        let skipNumbering = forceSkip || skip;
        const counters = {};

        function setSkipNumbering(flag) {
            if (!forceSkip) {
                skipNumbering = flag;
            }
        }

        function namer(baseName, nodeName = null) {
            if (skipNumbering || (baseName && baseName.includes('.'))) {
                return nodeName || baseName;
            }
            if (!counters[baseName]) counters[baseName] = 0;
            counters[baseName]++;
            const index = String(counters[baseName]).padStart(2, '0');
            return `${nodeName || baseName}-${index}`;
        }

        return { namer, setSkipNumbering };
    }

    async function initKVStore(env) {
        if (env.C) {
            try {
                kvStore = env.C;
                await loadKVConfig();
            } catch (error) {
                kvStore = null;
            }
        } else {
        }
    }

    async function loadKVConfig(force = false) {
        if (!kvStore) {
            return;
        }

        if (!force && kvConfigLastLoad > 0 && (Date.now() - kvConfigLastLoad) < KV_CACHE_TTL) {
            return;
        }

        try {
            const configData = await kvStore.get('c');
            if (configData) {
                kvConfig = JSON.parse(configData);
            } else {
            }
            kvConfigLastLoad = Date.now();
        } catch (error) {
            kvConfig = {};
        }
    }

    async function saveKVConfig() {
        if (!kvStore) {
            return;
        }

        try {
            const configString = JSON.stringify(kvConfig);
            await kvStore.put('c', configString);
            kvConfigLastLoad = Date.now();
        } catch (error) {
            throw error; 
        }
    }

    function getConfigValue(key, defaultValue = '') {
        if (kvConfig[key] !== undefined) {
            return kvConfig[key];
        }
        return defaultValue;
    }

    async function setConfigValue(key, value) {
        kvConfig[key] = value;
        await saveKVConfig();
    }

    async function detectWorkerRegion(request) {
        try {
            const cfCountry = request.cf?.country;
            if (cfCountry) {
                const countryToRegion = {
                    'US': 'US', 'SG': 'SG', 'JP': 'JP', 'KR': 'KR',
                    'DE': 'DE', 'SE': 'SE', 'NL': 'NL', 'FI': 'FI', 'GB': 'GB',
                    'CN': 'SG', 'TW': 'JP', 'AU': 'SG', 'CA': 'US',
                    'FR': 'DE', 'IT': 'DE', 'ES': 'DE', 'CH': 'DE',
                    'AT': 'DE', 'BE': 'NL', 'DK': 'SE', 'NO': 'SE', 'IE': 'GB'
                };

                if (countryToRegion[cfCountry]) {
                    return countryToRegion[cfCountry];
                }
            }
            return 'SG';
            
        } catch (error) {
            return 'SG';
        }
    }

    async function checkIPAvailability(domain, port = 443, timeout = 2000) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(`https://${domain}`, {
                method: 'HEAD',
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; CF-IP-Checker/1.0)'
                }
            });

            clearTimeout(timeoutId);
            return response.status < 500;
        } catch (error) {
            return true;
        }
    }

    async function getBestBackupIP(workerRegion = '', useRegionMatching = enableRegionMatching) {
        if (backupIPs.length === 0) {
            return null;
        }

        const availableIPs = backupIPs.map(ip => ({ ...ip, available: true }));

        if (useRegionMatching && workerRegion) {
            const sortedIPs = getSmartRegionSelection(workerRegion, availableIPs, useRegionMatching);
            if (sortedIPs.length > 0) {
                const selectedIP = sortedIPs[0];
                return selectedIP;
            }
        }

        const selectedIP = availableIPs[0];
        return selectedIP;
    }

    function getNearbyRegions(region) {
        const nearbyMap = {
            'US': ['SG', 'JP', 'KR'], 
            'SG': ['JP', 'KR', 'US'], 
            'JP': ['SG', 'KR', 'US'], 
            'KR': ['JP', 'SG', 'US'], 
            'DE': ['NL', 'GB', 'SE', 'FI'], 
            'SE': ['DE', 'NL', 'FI', 'GB'], 
            'NL': ['DE', 'GB', 'SE', 'FI'], 
            'FI': ['SE', 'DE', 'NL', 'GB'], 
            'GB': ['DE', 'NL', 'SE', 'FI']  
        };

        return nearbyMap[region] || [];
    }

    function getAllRegionsByPriority(region) {
        const nearbyRegions = getNearbyRegions(region);
        const allRegions = ['US', 'SG', 'JP', 'KR', 'DE', 'SE', 'NL', 'FI', 'GB'];

        return [region, ...nearbyRegions, ...allRegions.filter(r => r !== region && !nearbyRegions.includes(r))];
    }

    function getSmartRegionSelection(workerRegion, availableIPs, useRegionMatching = enableRegionMatching) {
        if (!useRegionMatching || !workerRegion) {
            return availableIPs;
        }

        const priorityRegions = getAllRegionsByPriority(workerRegion);

        const sortedIPs = [];

        for (const region of priorityRegions) {
            const regionIPs = availableIPs.filter(ip => ip.regionCode === region);
            sortedIPs.push(...regionIPs);
        }

        return sortedIPs;
    }

    function parseAddressAndPort(input) {
        if (input.includes('[') && input.includes(']')) {
            const match = input.match(/^\[([^\]]+)\](?::(\d+))?$/);
            if (match) {
                return {
                    address: match[1],
                    port: match[2] ? parseInt(match[2], 10) : null
                };
            }
        }

        const lastColonIndex = input.lastIndexOf(':');
        if (lastColonIndex > 0) {
            const address = input.substring(0, lastColonIndex);
            const portStr = input.substring(lastColonIndex + 1);
            const port = parseInt(portStr, 10);

            // address 含 ':' 说明是裸 IPv6（如 2001:db8::1），整体当地址，无端口
            if (!address.includes(':') && !isNaN(port) && port > 0 && port <= 65535) {
                return { address, port };
            }
        }

        return { address: input, port: null };
    }

    export default {
        async fetch(request, env, ctx) {
            try {
                const isWebSocket = request.headers.get('Upgrade') === atob('d2Vic29ja2V0');
                const isPost = request.method === 'POST';
                const reqUrl = new URL(request.url);
                const pathSegments = reqUrl.pathname.split('/').filter(p => p);

                if (!isWebSocket && !isPost && reqUrl.pathname !== '/') {
                    const tmpAt = (env.u || env.U || '').toLowerCase();
                    const tmpCp = (env.d || env.D || '').toLowerCase();
                    const firstSeg = pathSegments[0] || '';
                    const cleanCp = tmpCp.startsWith('/') ? tmpCp.substring(1) : tmpCp;
                    if (firstSeg !== tmpAt && (cleanCp ? firstSeg !== cleanCp : false)) {
                        return new Response('Not Found', { status: 404 });
                    }
                }

                await initKVStore(env);

                at = (env.u || env.U || at).toLowerCase();
                const subPath = (env.d || env.D || at).toLowerCase();

                const ci = getConfigValue('p', env.p || env.P);
                let useCustomIP = false;

                // 【已支持多选】wk 多地区处理
const manualRegionStr = getConfigValue('wk', env.wk || env.WK || '');
let manualRegionsList = [];

if (manualRegionStr && manualRegionStr.trim()) {
    manualRegionsList = manualRegionStr.split(',')
        .map(r => r.trim().toUpperCase())
        .filter(r => r.length > 0);

    if (manualRegionsList.length > 0) {
        manualWorkerRegion = manualRegionsList[0];           // 第一个作为主优先级
        currentWorkerRegion = manualRegionsList.join(',');   // 保存完整列表
    }
} else if (ci && ci.trim()) {
    useCustomIP = true;
    currentWorkerRegion = 'CUSTOM';
} else {
    currentWorkerRegion = await detectWorkerRegion(request);
}

                const regionMatchingControl = env.rm || env.RM;
                if (regionMatchingControl && regionMatchingControl.toLowerCase() === 'no') {
                    enableRegionMatching = false;
                }

                const envFallback = getConfigValue('p', env.p || env.P);
                if (envFallback) {
                    fallbackAddress = envFallback.trim();
                }

                socks5Config = getConfigValue('s', env.s || env.S) || socks5Config;
                if (socks5Config) {
                    try {
                        parsedSocks5Config = parseSocksConfig(socks5Config);
                        isSocksEnabled = true;
                    } catch (err) {
                        isSocksEnabled = false;
                    }
                }

                const customPreferred = getConfigValue('yx', env.yx || env.YX);
                if (customPreferred) {
                    try {
                        const preferredList = customPreferred.split(',').map(item => item.trim()).filter(item => item);
                        customPreferredIPs = [];
                        customPreferredDomains = [];

                        preferredList.forEach(item => {

                            let nodeName = '';
                            let addressPart = item;

                            if (item.includes('#')) {
                                const parts = item.split('#');
                                addressPart = parts[0].trim();
                                nodeName = parts[1].trim();
                            }

                            const { address, port } = parseAddressAndPort(addressPart);

                            if (!nodeName) {
                                nodeName = '自定义优选-' + address + (port ? ':' + port : '');
                            }

                            if (isValidIP(address)) {
                                customPreferredIPs.push({ 
                                    ip: address, 
                                    port: port,
                                    isp: nodeName
                                });
                            } else {
                                customPreferredDomains.push({ 
                                    domain: address, 
                                    port: port,
                                    name: nodeName
                                });
                            }
                        });
                    } catch (err) {
                        customPreferredIPs = [];
                        customPreferredDomains = [];
                    }
                }

                const downgradeControl = getConfigValue('qj', env.qj || env.QJ);
                if (downgradeControl && downgradeControl.toLowerCase() === 'no') {
                    enableSocksDowngrade = true;
                }

                const dkbyControl = getConfigValue('dkby', env.dkby || env.DKBY);
                if (dkbyControl && dkbyControl.toLowerCase() === 'yes') {
                    disableNonTLS = true;
                }

                const yxbyControl = env.yxby || env.YXBY;
                if (yxbyControl && yxbyControl.toLowerCase() === 'yes') {
                    disablePreferred = true;
                }

                const vlessControl = getConfigValue('ev', env.ev);
                if (vlessControl !== undefined && vlessControl !== '') {
                    ev = vlessControl === 'yes' || vlessControl === true || vlessControl === 'true';
                }

                const tjControl = getConfigValue('et', env.et);
                if (tjControl !== undefined && tjControl !== '') {
                    et = tjControl === 'yes' || tjControl === true || tjControl === 'true';
                }

                tp = getConfigValue('tp', env.tp) || '';

                const xhttpControl = getConfigValue('ex', env.ex);
                if (xhttpControl !== undefined && xhttpControl !== '') {
                    ex = xhttpControl === 'yes' || xhttpControl === true || xhttpControl === 'true';
                }

                scu = getConfigValue('scu', env.scu) || 'https://url.v1.mk/sub';

                const preferredDomainsControl = getConfigValue('epd', env.epd || 'no');
                if (preferredDomainsControl !== undefined && preferredDomainsControl !== '') {
                    epd = preferredDomainsControl !== 'no' && preferredDomainsControl !== false && preferredDomainsControl !== 'false';
                }

                const preferredIPsControl = getConfigValue('epi', env.epi);
                if (preferredIPsControl !== undefined && preferredIPsControl !== '') {
                    epi = preferredIPsControl !== 'no' && preferredIPsControl !== false && preferredIPsControl !== 'false';
                }

                const githubIPsControl = getConfigValue('egi', env.egi);
                if (githubIPsControl !== undefined && githubIPsControl !== '') {
                    egi = githubIPsControl !== 'no' && githubIPsControl !== false && githubIPsControl !== 'false';
                }

                const nativeAddressControl = getConfigValue('ena', env.ena);
                if (nativeAddressControl !== undefined && nativeAddressControl !== '') {
                    ena = nativeAddressControl !== 'no' && nativeAddressControl !== false && nativeAddressControl !== 'false';
                }

                const echControl = getConfigValue('ech', env.ech);
                if (echControl !== undefined && echControl !== '') {
                    enableECH = echControl === 'yes' || echControl === true || echControl === 'true';
                }

                // 加载自定义DNS和ECH域名配置
                const customDNSValue = getConfigValue('customDNS', '');
                if (customDNSValue && customDNSValue.trim()) {
                    customDNS = customDNSValue.trim();
                }

                const customECHDomainValue = getConfigValue('customECHDomain', '');
                if (customECHDomainValue && customECHDomainValue.trim()) {
                    customECHDomain = customECHDomainValue.trim();
                }

                // 如果启用了ECH，自动启用仅TLS模式（避免80端口干扰）
                // ECH需要TLS才能工作，所以必须禁用非TLS节点
                if (enableECH) {
                    disableNonTLS = true;
                    // 检查 KV 中是否有 dkby: yes，没有就直接写入
                    const currentDkby = getConfigValue('dkby', '');
                    if (currentDkby !== 'yes') {
                        await setConfigValue('dkby', 'yes');
                    }
                }

                if (!ev && !et && !ex) {
                    ev = true;
                }

                piu = getConfigValue('yxURL', env.yxURL || env.YXURL) || '';

                cp = getConfigValue('d', env.d || env.D) || '';

                const url = new URL(request.url);

                if (url.pathname.includes('/api/config')) {
                    const pathParts = url.pathname.split('/').filter(p => p);

                    const apiIndex = pathParts.indexOf('api');
                    if (apiIndex > 0) {
                        const pathSegments = pathParts.slice(0, apiIndex);
                        const pathIdentifier = pathSegments.join('/');
                        
                    let isValid = false;
                    if (cp && cp.trim()) {
                        const cleanCustomPath = cp.trim().startsWith('/') ? cp.trim().substring(1) : cp.trim();
                        isValid = (pathIdentifier === cleanCustomPath);
                        } else {
                            isValid = (isValidFormat(pathIdentifier) && pathIdentifier === at);
                        }

                        if (isValid) {
                            return await handleConfigAPI(request);
                        } else {
                            return new Response(JSON.stringify({ error: '路径验证失败' }), { 
                                status: 403,
                                headers: { 'Content-Type': 'application/json' }
                            });
                        }
                    }

                    return new Response(JSON.stringify({ error: '无效的API路径' }), { 
                        status: 404,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }

                if (url.pathname.includes('/api/preferred-ips')) {
                    const pathParts = url.pathname.split('/').filter(p => p);
                    const apiIndex = pathParts.indexOf('api');
                    if (apiIndex > 0) {
                        const pathSegments = pathParts.slice(0, apiIndex);
                        const pathIdentifier = pathSegments.join('/');

                        let isValid = false;
                        if (cp && cp.trim()) {
                            const cleanCustomPath = cp.trim().startsWith('/') ? cp.trim().substring(1) : cp.trim();
                            isValid = (pathIdentifier === cleanCustomPath);
                        } else {
                            isValid = (isValidFormat(pathIdentifier) && pathIdentifier === at);
                        }

                        if (isValid) {
                            return await handlePreferredIPsAPI(request);
                        } else {
                            return new Response(JSON.stringify({ error: '路径验证失败' }), { 
                                status: 403,
                                headers: { 'Content-Type': 'application/json' }
                            });
                        }
                    }

                    return new Response(JSON.stringify({ error: '无效的API路径' }), { 
                        status: 404,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }

            if (request.method === 'POST' && ex) {
                const r = await handleXhttpPost(request);
                if (r) {
                    ctx.waitUntil(r.closed);
                    return new Response(r.readable, {
                        headers: {
                            'X-Accel-Buffering': 'no',
                            'Cache-Control': 'no-store',
                            Connection: 'keep-alive',
                            'User-Agent': 'Go-http-client/2.0',
                            'Content-Type': 'application/grpc',
                        },
                    });
                }
                return new Response('Internal Server Error', { status: 500 });
            }

            if (request.headers.get('Upgrade') === atob('d2Vic29ja2V0')) {
                return await handleWsRequest(request);
                }

                if (request.method === 'GET') {
                    // 处理 /{UUID}/region 或 /{自定义路径}/region
                    if (url.pathname.endsWith('/region')) {
                        const pathParts = url.pathname.split('/').filter(p => p);

                        if (pathParts.length === 2 && pathParts[1] === 'region') {
                            const pathIdentifier = pathParts[0];
                            let isValid = false;

                            if (cp && cp.trim()) {
                                // 使用自定义路径
                                const cleanCustomPath = cp.trim().startsWith('/') ? cp.trim().substring(1) : cp.trim();
                                isValid = (pathIdentifier === cleanCustomPath);
                            } else {
                                // 使用UUID路径
                                isValid = (isValidFormat(pathIdentifier) && pathIdentifier === at);
                            }

                            if (isValid) {
                                const ci = getConfigValue('p', env.p || env.P);
                                const manualRegion = getConfigValue('wk', env.wk || env.WK);

                                if (manualRegion && manualRegion.trim()) {
                                    return new Response(JSON.stringify({
                                        region: manualRegion.trim().toUpperCase(),
                                        detectionMethod: '手动指定地区',
                                        manualRegion: manualRegion.trim().toUpperCase(),
                                        timestamp: new Date().toISOString()
                                    }), {
                                        headers: { 'Content-Type': 'application/json' }
                                    });
                                } else if (ci && ci.trim()) {
                                    return new Response(JSON.stringify({
                                        region: 'CUSTOM',
                                        detectionMethod: '自定义ProxyIP模式', ci: ci,
                                        timestamp: new Date().toISOString()
                                    }), {
                                        headers: { 'Content-Type': 'application/json' }
                                    });
                                } else {
                                    const detectedRegion = await detectWorkerRegion(request);
                                    return new Response(JSON.stringify({
                                        region: detectedRegion,
                                        detectionMethod: 'API检测',
                                        timestamp: new Date().toISOString()
                                    }), {
                                        headers: { 'Content-Type': 'application/json' }
                                    });
                                }
                            } else {
                                return new Response(JSON.stringify({ 
                                    error: '访问被拒绝',
                                    message: '路径验证失败'
                                }), { 
                                    status: 403,
                                    headers: { 'Content-Type': 'application/json' }
                                });
                            }
                        }
                    }

                    // 处理 /{UUID}/test-api 或 /{自定义路径}/test-api
                    if (url.pathname.endsWith('/test-api')) {
                        const pathParts = url.pathname.split('/').filter(p => p);

                        if (pathParts.length === 2 && pathParts[1] === 'test-api') {
                            const pathIdentifier = pathParts[0];
                            let isValid = false;

                            if (cp && cp.trim()) {
                                // 使用自定义路径
                                const cleanCustomPath = cp.trim().startsWith('/') ? cp.trim().substring(1) : cp.trim();
                                isValid = (pathIdentifier === cleanCustomPath);
                            } else {
                                // 使用UUID路径
                                isValid = (isValidFormat(pathIdentifier) && pathIdentifier === at);
                            }

                            if (isValid) {
                                try {
                                    const testRegion = await detectWorkerRegion(request);
                                    return new Response(JSON.stringify({
                                        detectedRegion: testRegion,
                                        message: 'API测试完成',
                                        timestamp: new Date().toISOString()
                                    }), {
                                        headers: { 'Content-Type': 'application/json' }
                                    });
                                } catch (error) {
                                    return new Response(JSON.stringify({
                                        error: error.message,
                                        message: 'API测试失败'
                                    }), {
                                        status: 500,
                                        headers: { 'Content-Type': 'application/json' }
                                    });
                                }
                            } else {
                                return new Response(JSON.stringify({ 
                                    error: '访问被拒绝',
                                    message: '路径验证失败'
                                }), { 
                                    status: 403,
                                    headers: { 'Content-Type': 'application/json' }
                                });
                            }
                        }
                    }

                    if (url.pathname === '/') {
                        // 检查是否有自定义首页URL配置
                        const customHomepage = getConfigValue('homepage', env.homepage || env.HOMEPAGE);
                        if (customHomepage && customHomepage.trim()) {
                            try {
                                // 从自定义URL获取内容
                                const homepageResponse = await fetch(customHomepage.trim(), {
                                    method: 'GET',
                                    headers: {
                                        'User-Agent': request.headers.get('User-Agent') || 'Mozilla/5.0',
                                        'Accept': request.headers.get('Accept') || '*/*',
                                        'Accept-Language': request.headers.get('Accept-Language') || 'en-US,en;q=0.9',
                                    },
                                    redirect: 'follow'
                                });

                                if (homepageResponse.ok) {
                                    // 获取响应内容
                                    const contentType = homepageResponse.headers.get('Content-Type') || 'text/html; charset=utf-8';
                                    const content = await homepageResponse.text();
                                    
                                    // 返回自定义首页内容
                                    return new Response(content, {
                                        status: homepageResponse.status,
                                        headers: {
                                            'Content-Type': contentType,
                                            'Cache-Control': 'no-cache, no-store, must-revalidate',
                                        }
                                    });
                                }
                            } catch (error) {
                                // 如果获取失败，继续使用默认终端页面
                                console.error('获取自定义首页失败:', error);
                            }
                        }
                        // 优先检查Cookie中的语言设置
                        const cookieHeader = request.headers.get('Cookie') || '';
                        let langFromCookie = null;
                        if (cookieHeader) {
                            const cookies = cookieHeader.split(';').map(c => c.trim());
                            for (const cookie of cookies) {
                                if (cookie.startsWith('preferredLanguage=')) {
                                    langFromCookie = cookie.split('=')[1];
                                    break;
                                }
                            }
                        }

                        let isFarsi = false;

                        if (langFromCookie === 'fa' || langFromCookie === 'fa-IR') {
                            isFarsi = true;
                        } else if (langFromCookie === 'zh' || langFromCookie === 'zh-CN') {
                            isFarsi = false;
                        } else {
                            // 如果没有Cookie，使用浏览器语言检测
                            const acceptLanguage = request.headers.get('Accept-Language') || '';
                            const browserLang = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
                            isFarsi = browserLang === 'fa' || acceptLanguage.includes('fa-IR') || acceptLanguage.includes('fa');
                        }

                        const lang = isFarsi ? 'fa' : 'zh-CN';
                        const langAttr = isFarsi ? 'fa-IR' : 'zh-CN';
                            
                        const translations = {
                            zh: {
                                title: '终端',
                                terminal: '终端',
                                congratulations: '恭喜你来到这',
                                enterU: '请输入你U变量的值',
                                enterD: '请输入你D变量的值',
                                command: '命令: connect [',
                                uuid: 'UUID',
                                path: 'PATH',
                                inputU: '输入U变量的内容并且回车...',
                                inputD: '输入D变量的内容并且回车...',
                                connecting: '正在连接...',
                                invading: '正在入侵...',
                                success: '连接成功！返回结果...',
                                error: '错误: 无效的UUID格式',
                                 reenter: '请重新输入有效的UUID'
                            },
                            fa: {
                                title: 'ترمینال',
                                terminal: 'ترمینال',
                                congratulations: 'تبریک می‌گوییم به شما',
                                enterU: 'لطفا مقدار متغیر U خود را وارد کنید',
                                enterD: 'لطفا مقدار متغیر D خود را وارد کنید',
                                command: 'دستور: connect [',
                                uuid: 'UUID',
                                path: 'PATH',
                                inputU: 'محتویات متغیر U را وارد کرده و Enter را بزنید...',
                                inputD: 'محتویات متغیر D را وارد کرده و Enter را بزنید...',
                                connecting: 'در حال اتصال...',
                                invading: 'در حال نفوذ...',
                                success: 'اتصال موفق! در حال بازگشت نتیجه...',
                                error: 'خطا: فرمت UUID نامعتبر',
                                reenter: 'لطفا UUID معتبر را دوباره وارد کنید'
                            }
                        };
                            
                        const t = translations[isFarsi ? 'fa' : 'zh'];
                            
    const terminalHtml = `<!DOCTYPE html>
    <html lang="${langAttr}" dir="${isFarsi ? 'rtl' : 'ltr'}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${t.title}</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: "Courier New", monospace;
                background: #000; color: #00ff00; min-height: 100vh;
                overflow-x: hidden; position: relative;
                display: flex; justify-content: center; align-items: center;
            }
            .matrix-bg {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: #000;
                z-index: -1;
            }
            @keyframes bg-pulse {
                0%, 100% { background: linear-gradient(45deg, #000 0%, #001100 50%, #000 100%); }
                50% { background: linear-gradient(45deg, #000 0%, #002200 50%, #000 100%); }
            }
            .matrix-rain {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: transparent;
                z-index: -1;
                display: none;
            }
            @keyframes matrix-fall {
                0% { transform: translateY(-100%); }
                100% { transform: translateY(100vh); }
            }
            .matrix-code-rain {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                pointer-events: none; z-index: -1;
                overflow: hidden;
                display: none;
            }
            .matrix-column {
                position: absolute; top: -100%; left: 0;
                color: #00ff00; font-family: "Courier New", monospace;
                font-size: 14px; line-height: 1.2;
                text-shadow: 0 0 5px #00ff00;
            }
            @keyframes matrix-drop {
                0% { top: -100%; opacity: 1; }
                10% { opacity: 1; }
                90% { opacity: 0.3; }
                100% { top: 100vh; opacity: 0; }
            }
            .matrix-column:nth-child(odd) {
                animation-duration: 12s;
                animation-delay: -2s;
            }
            .matrix-column:nth-child(even) {
                animation-duration: 18s;
                animation-delay: -5s;
            }
            .matrix-column:nth-child(3n) {
                animation-duration: 20s;
                animation-delay: -8s;
            }
            .terminal {
                width: 90%; max-width: 800px; height: 500px;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #00ff00;
                border-radius: 8px;
                box-shadow: 0 0 30px rgba(0, 255, 0, 0.5), inset 0 0 20px rgba(0, 255, 0, 0.1);
                backdrop-filter: blur(10px);
                position: relative; z-index: 1;
                overflow: hidden;
            }
            .terminal-header {
                background: rgba(0, 20, 0, 0.8);
                padding: 10px 15px;
                border-bottom: 1px solid #00ff00;
                display: flex; align-items: center;
            }
            .terminal-buttons {
                display: flex; gap: 8px;
            }
            .terminal-button {
                width: 12px; height: 12px; border-radius: 50%;
                background: #ff5f57; border: none;
            }
            .terminal-button:nth-child(2) { background: #ffbd2e; }
            .terminal-button:nth-child(3) { background: #28ca42; }
            .terminal-title {
                margin-left: 15px; color: #00ff00;
                font-size: 14px; font-weight: bold;
            }
            .terminal-body {
                padding: 20px; height: calc(100% - 50px);
                overflow-y: auto; font-size: 14px;
                line-height: 1.4;
            }
            .terminal-line {
                margin-bottom: 8px; display: flex; align-items: center;
            }
            .terminal-prompt {
                color: #00ff00; margin-right: 10px;
                font-weight: bold;
            }
            .terminal-input {
                background: transparent; border: none; outline: none;
                color: #00ff00; font-family: "Courier New", monospace;
                font-size: 14px; flex: 1;
                caret-color: #00ff00;
            }
            .terminal-input::placeholder {
                color: #00aa00; opacity: 0.7;
            }
            .terminal-cursor {
                display: inline-block; width: 8px; height: 16px;
                background: #00ff00;
                margin-left: 2px;
            }
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
            .terminal-output {
                color: #00aa00; margin: 5px 0;
            }
            .terminal-error {
                color: #ff4444; margin: 5px 0;
            }
            .terminal-success {
                color: #44ff44; margin: 5px 0;
            }
            .matrix-text {
                position: fixed; top: 20px; right: 20px;
                color: #00ff00; font-family: "Courier New", monospace;
                font-size: 0.8rem; opacity: 0.6;
            }
            @keyframes matrix-flicker {
                0%, 100% { opacity: 0.6; }
                50% { opacity: 1; }
            }
        </style>
    </head>
    <body>
        <div class="matrix-bg"></div>
        <div class="matrix-rain"></div>
        <div class="matrix-code-rain" id="matrixCodeRain"></div>
            <div class="matrix-text">${t.terminal}</div>
            <div style="position: fixed; top: 20px; left: 20px; z-index: 1000;">
                <select id="languageSelector" style="background: rgba(0, 20, 0, 0.9); border: 2px solid #00ff00; color: #00ff00; padding: 8px 12px; font-family: 'Courier New', monospace; font-size: 14px; cursor: pointer; text-shadow: 0 0 5px #00ff00; box-shadow: 0 0 15px rgba(0, 255, 0, 0.4);" onchange="changeLanguage(this.value)">
                    <option value="zh" ${!isFarsi ? 'selected' : ''}>🇨🇳 中文</option>
                    <option value="fa" ${isFarsi ? 'selected' : ''}>🇮🇷 فارسی</option>
                </select>
            </div>
        <div class="terminal">
            <div class="terminal-header">
                <div class="terminal-buttons">
                    <div class="terminal-button"></div>
                    <div class="terminal-button"></div>
                    <div class="terminal-button"></div>
                </div>
                    <div class="terminal-title">${t.terminal}</div>
            </div>
            <div class="terminal-body" id="terminalBody">
                <div class="terminal-line">
                    <span class="terminal-prompt">root:~$</span>
                        <span class="terminal-output">${t.congratulations}</span>
                </div>
                <div class="terminal-line">
                    <span class="terminal-prompt">root:~$</span>
                        <span class="terminal-output">${cp && cp.trim() ? t.enterD : t.enterU}</span>
                </div>
                <div class="terminal-line">
                    <span class="terminal-prompt">root:~$</span>
                        <span class="terminal-output">${t.command}${cp && cp.trim() ? t.path : t.uuid}]</span>
                </div>
                <div class="terminal-line">
                    <span class="terminal-prompt">root:~$</span>
                        <input type="text" class="terminal-input" id="uuidInput" placeholder="${cp && cp.trim() ? t.inputD : t.inputU}" autofocus>
                    <span class="terminal-cursor"></span>
                </div>
            </div>
        </div>
        <script>
            function createMatrixRain() {
                const matrixContainer = document.getElementById('matrixCodeRain');
                const matrixChars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                const columns = Math.floor(window.innerWidth / 18);

                for (let i = 0; i < columns; i++) {
                    const column = document.createElement('div');
                    column.className = 'matrix-column';
                    column.style.left = (i * 18) + 'px';
                    column.style.animationDelay = Math.random() * 15 + 's';
                    column.style.animationDuration = (Math.random() * 15 + 8) + 's';
                    column.style.fontSize = (Math.random() * 4 + 12) + 'px';
                    column.style.opacity = Math.random() * 0.8 + 0.2;

                    let text = '';
                    const charCount = Math.floor(Math.random() * 30 + 20);
                    for (let j = 0; j < charCount; j++) {
                        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                        const brightness = Math.random() > 0.1 ? '#00ff00' : '#00aa00';
                        text += '<span style="color: ' + brightness + ';">' + char + '</span><br>';
                    }
                    column.innerHTML = text;
                    matrixContainer.appendChild(column);
                }

                setInterval(function() {
                    const columns = matrixContainer.querySelectorAll('.matrix-column');
                    columns.forEach(function(column) {
                        if (Math.random() > 0.95) {
                            const chars = column.querySelectorAll('span');
                            if (chars.length > 0) {
                                const randomChar = chars[Math.floor(Math.random() * chars.length)];
                                randomChar.style.color = '#ffffff';
                                setTimeout(function() {
                                    randomChar.style.color = '#00ff00';
                                }, 200);
                            }
                        }
                    });
                }, 100);
            }

            function isValidUUID(uuid) {
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                return uuidRegex.test(uuid);
            }

            function addTerminalLine(content, type = 'output') {
                const terminalBody = document.getElementById('terminalBody');
                const line = document.createElement('div');
                line.className = 'terminal-line';

                const prompt = document.createElement('span');
                prompt.className = 'terminal-prompt';
                prompt.textContent = 'root:~$';

                const output = document.createElement('span');
                output.className = 'terminal-' + type;
                output.textContent = content;

                line.appendChild(prompt);
                line.appendChild(output);
                terminalBody.appendChild(line);

                terminalBody.scrollTop = terminalBody.scrollHeight;
            }

            function handleUUIDInput() {
                const input = document.getElementById('uuidInput');
                const inputValue = input.value.trim();
                const cp = '${ cp }';

                if (inputValue) {
                    addTerminalLine(atob('Y29ubmVjdCA=') + inputValue, 'output');
                        const translations = {
                            zh: {
                                connecting: '正在连接...',
                                invading: '正在入侵...',
                                success: '连接成功！返回结果...',
                                error: '错误: 无效的UUID格式',
                                reenter: '请重新输入有效的UUID'
                            },
                            fa: {
                                connecting: 'در حال اتصال...',
                                invading: 'در حال نفوذ...',
                                success: 'اتصال موفق! در حال بازگشت نتیجه...',
                                error: 'خطا: فرمت UUID نامعتبر',
                                reenter: 'لطفا UUID معتبر را دوباره وارد کنید'
                            }
                        };
                        const browserLang = navigator.language || navigator.userLanguage || '';
                        const isFarsi = browserLang.includes('fa') || browserLang.includes('fa-IR');
                        const t = translations[isFarsi ? 'fa' : 'zh'];

                    if (cp) {
                        const cleanInput = inputValue.startsWith('/') ? inputValue : '/' + inputValue;
                            addTerminalLine(t.connecting, 'output');
                        setTimeout(() => {
                                addTerminalLine(t.success, 'success');
                            setTimeout(() => {
                                window.location.href = cleanInput;
                            }, 1000);
                        }, 500);
                    } else {
                        if (isValidUUID(inputValue)) {
                            addTerminalLine(t.invading, 'output');
                        setTimeout(() => {
                                addTerminalLine(t.success, 'success');
                            setTimeout(() => {
                                    window.location.href = '/' + inputValue;
                            }, 1000);
                        }, 500);
                    } else {
                            addTerminalLine(t.error, 'error');
                            addTerminalLine(t.reenter, 'output');
                        }
                    }

                    input.value = '';
                }
            }

            function changeLanguage(lang) {
                localStorage.setItem('preferredLanguage', lang);
                // 设置Cookie（有效期1年）
                const expiryDate = new Date();
                expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                document.cookie = 'preferredLanguage=' + lang + '; path=/; expires=' + expiryDate.toUTCString() + '; SameSite=Lax';
                // 刷新页面，不使用URL参数
                window.location.reload();
            }

            // 页面加载时检查 localStorage 和 Cookie，并清理URL参数
            window.addEventListener('DOMContentLoaded', function() {
                function getCookie(name) {
                    const value = '; ' + document.cookie;
                    const parts = value.split('; ' + name + '=');
                    if (parts.length === 2) return parts.pop().split(';').shift();
                    return null;
                }

                const savedLang = localStorage.getItem('preferredLanguage') || getCookie('preferredLanguage');
                const urlParams = new URLSearchParams(window.location.search);
                const urlLang = urlParams.get('lang');

                // 如果URL中有语言参数，移除它并设置Cookie
                if (urlLang) {
                    const currentUrl = new URL(window.location.href);
                    currentUrl.searchParams.delete('lang');
                    const newUrl = currentUrl.toString();

                    // 设置Cookie
                    const expiryDate = new Date();
                    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                    document.cookie = 'preferredLanguage=' + urlLang + '; path=/; expires=' + expiryDate.toUTCString() + '; SameSite=Lax';
                    localStorage.setItem('preferredLanguage', urlLang);

                    // 使用history API移除URL参数，不刷新页面
                    window.history.replaceState({}, '', newUrl);
                } else if (savedLang) {
                    // 如果localStorage中有但Cookie中没有，同步到Cookie
                    const expiryDate = new Date();
                    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                    document.cookie = 'preferredLanguage=' + savedLang + '; path=/; expires=' + expiryDate.toUTCString() + '; SameSite=Lax';
                }
            });

            document.addEventListener('DOMContentLoaded', function() {
                const input = document.getElementById('uuidInput');
                input.focus();
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        handleUUIDInput();
                    }
                });
            });
        </script>
    </body>
    </html>`;
            return new Response(terminalHtml, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }
            if (cp && cp.trim()) {
                const cleanCustomPath = cp.trim().startsWith('/') ? cp.trim() : '/' + cp.trim();
                const normalizedCustomPath = cleanCustomPath.endsWith('/') && cleanCustomPath.length > 1 ? cleanCustomPath.slice(0, -1) : cleanCustomPath;
                const normalizedPath = url.pathname.endsWith('/') && url.pathname.length > 1 ? url.pathname.slice(0, -1) : url.pathname;

                    if (normalizedPath === normalizedCustomPath) {
                        return await handleSubscriptionPage(request, at);
                    }

                    if (normalizedPath === normalizedCustomPath + '/sub') {
                        return await handleSubscriptionRequest(request, at, url);
                    }

                    if (url.pathname.length > 1 && url.pathname !== '/') {
                        const user = url.pathname.replace(/\/$/, '').replace('/sub', '').substring(1);
                        if (isValidFormat(user)) {
                            return new Response(JSON.stringify({ 
                                error: '访问被拒绝',
                                message: '当前 Worker 已启用自定义路径模式，UUID 访问已禁用'
                            }), { 
                                status: 403,
                                headers: { 'Content-Type': 'application/json' }
                            });
                        }
                    }
                } else {
                    
                    if (url.pathname.length > 1 && url.pathname !== '/' && !url.pathname.includes('/sub')) {
                        const user = url.pathname.replace(/\/$/, '').substring(1);
                        if (isValidFormat(user)) {
                            if (user === at) {
                                return await handleSubscriptionPage(request, user);
                            } else {
                                return new Response(JSON.stringify({ error: 'UUID错误 请注意变量名称是u不是uuid' }), { 
                                    status: 403,
                                    headers: { 'Content-Type': 'application/json' }
                                });
                            }
                        }
                    }
                    if (url.pathname.includes('/sub')) {
                        const pathParts = url.pathname.split('/');
                        if (pathParts.length === 2 && pathParts[1] === 'sub') {
                            const user = pathParts[0].substring(1);
                            if (isValidFormat(user)) {
                                if (user === at) {
                                    return await handleSubscriptionRequest(request, user, url);
                                } else {
                                    return new Response(JSON.stringify({ error: 'UUID错误' }), { 
                                        status: 403,
                                        headers: { 'Content-Type': 'application/json' }
                                    });
                                }
                                }
                            }
                        }
                    }
                    if (url.pathname.toLowerCase().includes(`/${subPath}`)) {
                        return await handleSubscriptionRequest(request, at);
                    }
                }
                return new Response(JSON.stringify({ error: 'Not Found' }), { 
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (err) {
                return new Response(err.toString(), { status: 500 });
            }
        },
    };

    function generateQuantumultConfig(links) {
        return btoa(links.join('\n'));
    }

    // 解析 VLESS/Trojan 链接并生成 Clash 节点配置
    function parseLinkToClashNode(link) {
        try {
            // 解析 VLESS 链接
            if (link.startsWith('vless://')) {
                const url = new URL(link);
                const name = decodeURIComponent(url.hash.substring(1));
                const uuid = url.username;
                const server = url.hostname;
                const port = parseInt(url.port) || 443;
                const params = new URLSearchParams(url.search);

                const tls = params.get('security') === 'tls' || params.get('tls') === 'true';
                const network = params.get('type') || 'ws';
                const path = params.get('path') || '/?ed=2048';
                const host = params.get('host') || server;
                const servername = params.get('sni') || host;
                const alpn = params.get('alpn') || 'h3';
                const fingerprint = params.get('fp') || params.get('client-fingerprint') || 'chrome';
                const ech = params.get('ech');

                const node = {
                    name: name,
                    type: 'vless',
                    server: server,
                    port: port,
                    uuid: uuid,
                    tls: tls,
                    network: network,
                    'client-fingerprint': fingerprint
                };

                if (tls) {
                    node.servername = servername;
                    node.alpn = alpn.split(',').map(a => a.trim());
                    node['skip-cert-verify'] = false;
                }

                if (network === 'ws') {
                    node['ws-opts'] = {
                        path: path,
                        headers: {
                            Host: host
                        }
                    };
                }

                if (ech) {
                    const echDomain = customECHDomain || 'cloudflare-ech.com';
                    node['ech-opts'] = {
                        enable: true,
                        'query-server-name': echDomain
                    };
                }

                return node;
            }
            
            // 解析 Trojan 链接
            if (link.startsWith('trojan://')) {
                const url = new URL(link);
                const name = decodeURIComponent(url.hash.substring(1));
                const password = url.username;
                const server = url.hostname;
                const port = parseInt(url.port) || 443;
                const params = new URLSearchParams(url.search);

                const network = params.get('type') || 'ws';
                const path = params.get('path') || '/?ed=2048';
                const host = params.get('host') || server;
                const sni = params.get('sni') || host;
                const alpn = params.get('alpn') || 'h3';
                const ech = params.get('ech');

                const node = {
                    name: name,
                    type: 'trojan',
                    server: server,
                    port: port,
                    password: password,
                    network: network,
                    sni: sni,
                    alpn: alpn.split(',').map(a => a.trim()),
                    'skip-cert-verify': false
                };

                if (network === 'ws') {
                    node['ws-opts'] = {
                        path: path,
                        headers: {
                            Host: host
                        }
                    };
                }

                if (ech) {
                    const echDomain = customECHDomain || 'cloudflare-ech.com';
                    node['ech-opts'] = {
                        enable: true,
                        'query-server-name': echDomain
                    };
                }

                return node;
            }
        } catch (e) {
            return null;
        }
        return null;
    }

    // 生成 Clash 配置
    async function generateClashConfig(links, request, user) {
        // 先通过订阅转换服务获取 Clash 配置
        const subscriptionUrl = new URL(request.url);
        subscriptionUrl.pathname = subscriptionUrl.pathname.replace(/\/sub$/, '') + '/sub';
        subscriptionUrl.searchParams.set('target', 'base64');
        const encodedUrl = encodeURIComponent(subscriptionUrl.toString());
        const converterUrl = `${scu}?target=clash&url=${encodedUrl}&insert=false&emoji=true&list=false&xudp=false&udp=false&tfo=false&expand=true&scv=false&fdn=false&new_name=true`;

        try {
            const response = await fetch(converterUrl);
            if (!response.ok) {
                throw new Error('订阅转换服务失败');
            }

            let clashConfig = await response.text();

            // 如果 ECH 开启，为所有节点添加 ECH 参数
            if (enableECH) {
                // 处理单行格式的节点：  - {name: ..., server: ..., ...}
                // 需要正确处理嵌套的花括号（如 ws-opts: {path: "...", headers: {Host: ...}}）
                clashConfig = clashConfig.split('\n').map(line => {
                    // 检查是否是节点行（以 "  - {" 开头，且包含 name: 和 server:）
                    if (/^\s*-\s*\{/.test(line) && line.includes('name:') && line.includes('server:')) {
                        // 检查是否已经有 ech-opts
                        if (line.includes('ech-opts')) {
                            return line; // 已有 ech-opts，不修改
                        }
                        // 找到最后一个 } 的位置（从右往左查找，处理嵌套花括号）
                        const lastBraceIndex = line.lastIndexOf('}');
                        if (lastBraceIndex > 0) {
                            // 检查最后一个 } 之前是否有内容，确保格式正确
                            const beforeBrace = line.substring(0, lastBraceIndex).trim();
                            if (beforeBrace.length > 0) {
                                // 在最后一个 } 之前添加 , ech-opts: {enable: true, query-server-name: ...}
                                // 确保在逗号前有空格
                                const echDomain = customECHDomain || 'cloudflare-ech.com';
                                const needsComma = !beforeBrace.endsWith(',') && !beforeBrace.endsWith('{');
                                return line.substring(0, lastBraceIndex) + (needsComma ? ', ' : ' ') + `ech-opts: {enable: true, query-server-name: ${echDomain}}` + line.substring(lastBraceIndex);
                            }
                        }
                    }
                    return line;
                }).join('\n');

                // 处理多行格式的节点（如果存在）
                // 只处理单行格式，多行格式由订阅转换服务处理，不需要额外修改
                // 如果订阅转换服务返回多行格式，通常已经是正确的格式
            }

            // 替换 DNS nameserver 为阿里的加密 DNS
            clashConfig = clashConfig.replace(/^(\s*nameserver:\s*\n)((?:\s*-\s*[^\n]+\n)*)/m, (match, header, items) => {
                // 替换所有 nameserver 项为阿里的加密 DNS
                const dnsServer = customDNS || 'https://223.5.5.5/dns-query';
                return header + `    - ${dnsServer}\n`;
            });

            return clashConfig;
        } catch (e) {
            // 如果订阅转换失败，返回错误
            throw new Error('无法获取 Clash 配置: ' + e.message);
        }
    }

    // 全局变量存储ECH调试信息
    let echDebugInfo = '';

    async function fetchECHConfig(domain) {
        if (!enableECH) {
            echDebugInfo = 'ECH功能已禁用';
            return null;
        }

        echDebugInfo = '';
        const debugSteps = [];

        try {
            // 优先使用 Google DNS 查询 cloudflare-ech.com 的 ECH 配置
            debugSteps.push('尝试使用 Google DNS 查询 cloudflare-ech.com...');
            const echDomainUrl = `https://v.recipes/dns/dns.google/dns-query?name=cloudflare-ech.com&type=65`;
            const echResponse = await fetch(echDomainUrl, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            debugSteps.push(`Google DNS 响应状态: ${echResponse.status}`);

            if (echResponse.ok) {
                const echData = await echResponse.json();
                debugSteps.push(`Google DNS 返回数据: ${JSON.stringify(echData).substring(0, 200)}...`);

                if (echData.Answer && echData.Answer.length > 0) {
                    debugSteps.push(`找到 ${echData.Answer.length} 条答案记录`);
                    for (const answer of echData.Answer) {
                        if (answer.data) {
                            debugSteps.push(`解析答案数据: ${typeof answer.data}, 长度: ${String(answer.data).length}`);
                            // Google DNS 返回的数据格式可能不同，需要解析
                            const dataStr = typeof answer.data === 'string' ? answer.data : JSON.stringify(answer.data);
                            const echMatch = dataStr.match(/ech=([^\s"']+)/);
                            if (echMatch && echMatch[1]) {
                                echDebugInfo = debugSteps.join('\\n') + '\\n✅ 成功从 Google DNS 获取 ECH 配置';
                                return echMatch[1];
                            }
                            // 如果没有找到，尝试直接使用 data（可能是 base64 编码的）
                            if (answer.data && !dataStr.includes('ech=')) {
                                try {
                                    const decoded = atob(answer.data);
                                    debugSteps.push(`尝试 base64 解码，解码后长度: ${decoded.length}`);
                                    const decodedMatch = decoded.match(/ech=([^\s"']+)/);
                                    if (decodedMatch && decodedMatch[1]) {
                                        echDebugInfo = debugSteps.join('\\n') + '\\n✅ 成功从 Google DNS (base64解码) 获取 ECH 配置';
                                        return decodedMatch[1];
                                    }
                                } catch (e) {
                                    debugSteps.push(`base64 解码失败: ${e.message}`);
                                }
                            }
                        }
                    }
                } else {
                    debugSteps.push('Google DNS 未返回答案记录');
                }
            } else {
                debugSteps.push(`Google DNS 请求失败: ${echResponse.status}`);
            }

            // 如果 cloudflare-ech.com 查询失败，尝试使用 Google DNS 查询目标域名的 HTTPS 记录
            debugSteps.push(`尝试使用 Google DNS 查询目标域名 ${domain}...`);
            const dohUrl = `https://v.recipes/dns/dns.google/dns-query?name=${encodeURIComponent(domain)}&type=65`;
            const response = await fetch(dohUrl, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            debugSteps.push(`Google DNS (目标域名) 响应状态: ${response.status}`);

            if (response.ok) {
                const data = await response.json();
                debugSteps.push(`Google DNS (目标域名) 返回数据: ${JSON.stringify(data).substring(0, 200)}...`);

                if (data.Answer && data.Answer.length > 0) {
                    debugSteps.push(`找到 ${data.Answer.length} 条答案记录`);
                    for (const answer of data.Answer) {
                        if (answer.data) {
                            const dataStr = typeof answer.data === 'string' ? answer.data : JSON.stringify(answer.data);
                            const echMatch = dataStr.match(/ech=([^\s"']+)/);
                            if (echMatch && echMatch[1]) {
                                echDebugInfo = debugSteps.join('\\n') + '\\n✅ 成功从 Google DNS (目标域名) 获取 ECH 配置';
                                return echMatch[1];
                            }
                            // 尝试 base64 解码
                            try {
                                const decoded = atob(answer.data);
                                const decodedMatch = decoded.match(/ech=([^\s"']+)/);
                                if (decodedMatch && decodedMatch[1]) {
                                    echDebugInfo = debugSteps.join('\\n') + '\\n✅ 成功从 Google DNS (目标域名, base64解码) 获取 ECH 配置';
                                    return decodedMatch[1];
                                }
                            } catch (e) {
                                debugSteps.push(`base64 解码失败: ${e.message}`);
                            }
                        }
                    }
                } else {
                    debugSteps.push('Google DNS (目标域名) 未返回答案记录');
                }
            } else {
                debugSteps.push(`Google DNS (目标域名) 请求失败: ${response.status}`);
            }

            // 如果 Google DNS 失败，尝试使用 Cloudflare DNS 作为备选
            debugSteps.push('尝试使用 Cloudflare DNS 作为备选...');
            const cfEchUrl = `https://cloudflare-dns.com/dns-query?name=cloudflare-ech.com&type=65`;
            const cfResponse = await fetch(cfEchUrl, {
                headers: {
                    'Accept': 'application/dns-json'
                }
            });

            debugSteps.push(`Cloudflare DNS 响应状态: ${cfResponse.status}`);

            if (cfResponse.ok) {
                const cfData = await cfResponse.json();
                debugSteps.push(`Cloudflare DNS 返回数据: ${JSON.stringify(cfData).substring(0, 200)}...`);

                if (cfData.Answer && cfData.Answer.length > 0) {
                    debugSteps.push(`找到 ${cfData.Answer.length} 条答案记录`);
                    for (const answer of cfData.Answer) {
                        if (answer.data) {
                            const echMatch = answer.data.match(/ech=([^\s"']+)/);
                            if (echMatch && echMatch[1]) {
                                echDebugInfo = debugSteps.join('\\n') + '\\n✅ 成功从 Cloudflare DNS 获取 ECH 配置';
                                return echMatch[1];
                            }
                        }
                    }
                } else {
                    debugSteps.push('Cloudflare DNS 未返回答案记录');
                }
            } else {
                debugSteps.push(`Cloudflare DNS 请求失败: ${cfResponse.status}`);
            }

            echDebugInfo = debugSteps.join('\\n') + '\\n❌ 所有DNS查询均失败，未获取到ECH配置';
            return null;
        } catch (error) {
            echDebugInfo = debugSteps.join('\\n') + '\\n❌ 获取ECH配置时发生错误: ' + error.message;
            return null;
        }
    }

    async function handleSubscriptionRequest(request, user, url = null) {
        if (!url) url = new URL(request.url);

        const finalLinks = [];
        const workerDomain = url.hostname;
        const target = url.searchParams.get('target') || 'base64';

        // 如果启用了ECH，使用自定义值
        let echConfig = null;
        if (enableECH) {
            const dnsServer = customDNS || 'https://223.5.5.5/dns-query';
            const echDomain = customECHDomain || 'cloudflare-ech.com';
            echConfig = `${echDomain}+${dnsServer}`;
        }

        async function addNodesFromList(list) {
            if (ev) {
                finalLinks.push(...generateLinksFromSource(list, user, workerDomain, echConfig));
            }
            if (et) {
                finalLinks.push(...await generateTrojanLinksFromSource(list, user, workerDomain, echConfig));
            }
            if (ex) {
                finalLinks.push(...generateXhttpLinksFromSource(list, user, workerDomain, echConfig));
            }
        }

        if (ena) {
            if (currentWorkerRegion === 'CUSTOM') {
                const nativeList = [{ ip: workerDomain, isp: '原生地址' }];
                await addNodesFromList(nativeList);
            } else {
                try {
                    const nativeList = [{ ip: workerDomain, isp: '原生地址' }];
                    await addNodesFromList(nativeList);
                } catch (error) {
                    if (!currentWorkerRegion) {
                        currentWorkerRegion = await detectWorkerRegion(request);
                    }

                    const bestBackupIP = await getBestBackupIP(currentWorkerRegion);
                    if (bestBackupIP) {
                        fallbackAddress = bestBackupIP.domain + ':' + bestBackupIP.port;
                        const backupList = [{ ip: bestBackupIP.domain, isp: 'ProxyIP-' + currentWorkerRegion }];
                        await addNodesFromList(backupList);
                    } else {
                        const nativeList = [{ ip: workerDomain, isp: '原生地址' }];
                        await addNodesFromList(nativeList);
                    }
                }
            }
        }

        const hasCustomPreferred = customPreferredIPs.length > 0 || customPreferredDomains.length > 0;

        if (disablePreferred) {
        } else if (hasCustomPreferred) {
            if (customPreferredIPs.length > 0 && epi) {
                await addNodesFromList(customPreferredIPs);
            }

            if (customPreferredDomains.length > 0 && epd) {
                const customDomainList = customPreferredDomains.map(d => ({ ip: d.domain, isp: d.name || d.domain }));
                await addNodesFromList(customDomainList);
            }
        } else {
            if (epd) {
            const domainList = directDomains.map(d => ({ ip: d.domain, isp: d.name || d.domain }));
                await addNodesFromList(domainList);
            }

            if (epi) {
                if (!piu) {
                try {
                    const dynamicIPList = await fetchDynamicIPs();
                    if (dynamicIPList.length > 0) {
                            await addNodesFromList(dynamicIPList);
                    }
                } catch (error) {
                    if (!currentWorkerRegion) {
                        currentWorkerRegion = await detectWorkerRegion(request);
                    }
                    
                    const bestBackupIP = await getBestBackupIP(currentWorkerRegion);
                    if (bestBackupIP) {
                        fallbackAddress = bestBackupIP.domain + ':' + bestBackupIP.port;
                        
                        const backupList = [{ ip: bestBackupIP.domain, isp: 'ProxyIP-' + currentWorkerRegion }];
                            await addNodesFromList(backupList);
                        }
                    }
                }
            }

            if (egi) {
            try {
                const newIPList = await fetchAndParseNewIPs();
                if (newIPList.length > 0) {
                    if (ev) {
                        finalLinks.push(...generateLinksFromNewIPs(newIPList, user, workerDomain, echConfig));
                    }
                    if (et) {
                        finalLinks.push(...await generateTrojanLinksFromNewIPs(newIPList, user, workerDomain, echConfig));
                    }
                    if (ex) {
                         finalLinks.push(...generateXhttpLinksFromSource(newIPList, user, workerDomain, echConfig));
                    }
                }
            } catch (error) {
                if (!currentWorkerRegion) {
                    currentWorkerRegion = await detectWorkerRegion(request);
                }

                const bestBackupIP = await getBestBackupIP(currentWorkerRegion);
                if (bestBackupIP) {
                    fallbackAddress = bestBackupIP.domain + ':' + bestBackupIP.port;
                    
                    const backupList = [{ ip: bestBackupIP.domain, isp: 'ProxyIP-' + currentWorkerRegion }];
                        await addNodesFromList(backupList);
                    }
                }
            }
        }

        if (finalLinks.length === 0) {
            const errorRemark = "所有节点获取失败";
            const proto = atob('dmxlc3M=');
            const errorLink = `${proto}://00000000-0000-0000-0000-000000000000@127.0.0.1:80?encryption=none&security=none&type=ws&host=error.com&path=%2F#${encodeURIComponent(errorRemark)}`;
            finalLinks.push(errorLink);
        }

        let subscriptionContent;
        let contentType = 'text/plain; charset=utf-8';

        switch (target.toLowerCase()) {
            case atob('Y2xhc2g='):
            case atob('Y2xhc2hy'):
                subscriptionContent = await generateClashConfig(finalLinks, request, user);
                contentType = 'text/yaml; charset=utf-8';
                break;
            case atob('c3VyZ2U='):
            case atob('c3VyZ2Uy'):
            case atob('c3VyZ2Uz'):
            case atob('c3VyZ2U0'):
                subscriptionContent = generateSurgeConfig(finalLinks);
                break;
            case atob('cXVhbnR1bXVsdA=='):
            case atob('cXVhbng='):
            case 'quanx':
                subscriptionContent = generateQuantumultConfig(finalLinks);
                break;
            case atob('c3M='):
            case atob('c3Ny'):
                subscriptionContent = generateSSConfig(finalLinks);
                break;
            case atob('djJyYXk='):
                subscriptionContent = generateV2RayConfig(finalLinks);
                break;
            case atob('bG9vbg=='):
                subscriptionContent = generateLoonConfig(finalLinks);
                break;
            default:
                subscriptionContent = btoa(finalLinks.join('\n'));
        }

        const responseHeaders = { 
            'Content-Type': contentType,
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        };

        // 添加ECH状态到响应头
        if (enableECH) {
            responseHeaders['X-ECH-Status'] = 'ENABLED';
            if (echConfig) {
                responseHeaders['X-ECH-Config-Length'] = String(echConfig.length);
            }
        }

        return new Response(subscriptionContent, {
            headers: responseHeaders,
        });
    }

    function generateLinksFromSource(list, user, workerDomain, echConfig = null, skipNumbering = false) {
        const CF_HTTP_PORTS = [80, 8080, 8880, 2052, 2082, 2086, 2095];
        const CF_HTTPS_PORTS = [443, 2053, 2083, 2087, 2096, 8443];

        const defaultHttpsPorts = [443];
        const defaultHttpPorts = disableNonTLS ? [] : [80];
        const links = [];
        const wsPath = '/?ed=2048';
        const proto = atob('dmxlc3M=');

        const { namer, setSkipNumbering } = createNodeNamer(skipNumbering);

        for (const item of list) {
            let nodeNameBase = item.isp.replace(/\s/g, '_');
            if (item.colo && item.colo.trim()) {
                nodeNameBase = `${nodeNameBase}-${item.colo.trim()}`;
            }
            const safeIP = item.ip.includes(':') ? `[${item.ip}]` : item.ip;

            let portsToGenerate = [];
            if (item.port) {
                const port = item.port;
                if (CF_HTTPS_PORTS.includes(port)) {
                    portsToGenerate.push({ port: port, tls: true });
                } else if (CF_HTTP_PORTS.includes(port)) {
                    if (!disableNonTLS) {
                        portsToGenerate.push({ port: port, tls: false });
                    }
                } else {
                    portsToGenerate.push({ port: port, tls: true });
                }
            } else {
                defaultHttpsPorts.forEach(port => {
                    portsToGenerate.push({ port: port, tls: true });
                });
                defaultHttpPorts.forEach(port => {
                    portsToGenerate.push({ port: port, tls: false });
                });
            }

            for (const { port, tls } of portsToGenerate) {
                const suffix = tls ? '-WS-TLS' : '-WS';
                const nodeName = `${nodeNameBase}-${port}${suffix}`;
                let wsNodeName;
                if (skipNumbering) {
                    wsNodeName = nodeName;           // 不编号
                } else {
                    wsNodeName = namer(nodeNameBase, nodeName);  // 编号
                }

                if (tls) {
                    const wsParams = new URLSearchParams({ 
                        encryption: 'none', 
                        security: 'tls', 
                        sni: workerDomain, 
                        fp: enableECH ? 'chrome' : 'randomized',
                        type: 'ws', 
                        host: workerDomain, 
                        path: wsPath
                    });

                    // 如果启用了ECH，添加ech参数（ECH需要伪装成Chrome浏览器）
                    if (enableECH) {
                        const dnsServer = customDNS || 'https://223.5.5.5/dns-query';
                        const echDomain = customECHDomain || 'cloudflare-ech.com';
                        wsParams.set('alpn', 'h3');
                        wsParams.set('ech', `${echDomain}+${dnsServer}`);
                    }

                    links.push(`${proto}://${user}@${safeIP}:${port}?${wsParams.toString()}#${encodeURIComponent(wsNodeName)}`);
                } else {
                    const wsParams = new URLSearchParams({
                        encryption: 'none',
                        security: 'none',
                        type: 'ws',
                        host: workerDomain,
                        path: wsPath
                    });

                    links.push(`${proto}://${user}@${safeIP}:${port}?${wsParams.toString()}#${encodeURIComponent(wsNodeName)}`);
                }
            }
        }
        return links;
    }

    async function generateTrojanLinksFromSource(list, user, workerDomain, echConfig = null, skipNumbering = false) {
        const CF_HTTP_PORTS = [80, 8080, 8880, 2052, 2082, 2086, 2095];
        const CF_HTTPS_PORTS = [443, 2053, 2083, 2087, 2096, 8443];

        const defaultHttpsPorts = [443];
        const defaultHttpPorts = disableNonTLS ? [] : [80];
        const links = [];
        const wsPath = '/?ed=2048';

        const password = tp || user;

        const { namer, setSkipNumbering } = createNodeNamer(skipNumbering);

        for (const item of list) {
            let nodeNameBase = item.isp.replace(/\s/g, '_');
            if (item.colo && item.colo.trim()) {
                nodeNameBase = `${nodeNameBase}-${item.colo.trim()}`;
            }
            const safeIP = item.ip.includes(':') ? `[${item.ip}]` : item.ip;

            let portsToGenerate = [];
            if (item.port) {
                const port = item.port;
                if (CF_HTTPS_PORTS.includes(port)) {
                    portsToGenerate.push({ port: port, tls: true });
                } else if (CF_HTTP_PORTS.includes(port)) {
                    if (!disableNonTLS) {
                        portsToGenerate.push({ port: port, tls: false });
                    }
                } else {
                    portsToGenerate.push({ port: port, tls: true });
                }
            } else {
                defaultHttpsPorts.forEach(port => {
                    portsToGenerate.push({ port: port, tls: true });
                });
                defaultHttpPorts.forEach(port => {
                    portsToGenerate.push({ port: port, tls: false });
                });
            }

            for (const { port, tls } of portsToGenerate) {
                const suffix = tls ? `-${atob('VHJvamFu')}-WS-TLS` : `-${atob('VHJvamFu')}-WS`;
                const nodeName = `${nodeNameBase}-${port}${suffix}`;
                let wsNodeName;
                if (skipNumbering) {
                    wsNodeName = nodeName;           // 不编号
                } else {
                    wsNodeName = namer(nodeNameBase, nodeName);  // 编号
                }

                if (tls) {
                    const wsParams = new URLSearchParams({ 
                        security: 'tls', 
                        sni: workerDomain, 
                        fp: 'chrome',
                        type: 'ws', 
                        host: workerDomain, 
                        path: wsPath
                    });

                    // 如果启用了ECH，添加ech参数（ECH需要伪装成Chrome浏览器）
                    if (enableECH) {
                        const dnsServer = customDNS || 'https://223.5.5.5/dns-query';
                        const echDomain = customECHDomain || 'cloudflare-ech.com';
                        wsParams.set('alpn', 'h3');
                        wsParams.set('ech', `${echDomain}+${dnsServer}`);
                    }

                    links.push(`${atob('dHJvamFuOi8v')}${password}@${safeIP}:${port}?${wsParams.toString()}#${encodeURIComponent(wsNodeName)}`);
                } else {
                    const wsParams = new URLSearchParams({
                        security: 'none',
                        type: 'ws',
                        host: workerDomain,
                        path: wsPath
                    });

                    links.push(`${atob('dHJvamFuOi8v')}${password}@${safeIP}:${port}?${wsParams.toString()}#${encodeURIComponent(wsNodeName)}`);
                }
            }
        }
        return links;
    }

    async function fetchDynamicIPs() {
        const v4Url1 = "https://www.wetest.vip/page/cloudflare/address_v4.html";
        const v6Url1 = "https://www.wetest.vip/page/cloudflare/address_v6.html";
        let results = [];

        // 读取筛选配置（默认全部启用）
        const ipv4Enabled = getConfigValue('ipv4', '') === '' || getConfigValue('ipv4', 'yes') !== 'no';
        const ipv6Enabled = getConfigValue('ipv6', '') === '' || getConfigValue('ipv6', 'yes') !== 'no';
        const ispMobile = getConfigValue('ispMobile', '') === '' || getConfigValue('ispMobile', 'yes') !== 'no';
        const ispUnicom = getConfigValue('ispUnicom', '') === '' || getConfigValue('ispUnicom', 'yes') !== 'no';
        const ispTelecom = getConfigValue('ispTelecom', '') === '' || getConfigValue('ispTelecom', 'yes') !== 'no';

        try {
            const fetchPromises = [];
            if (ipv4Enabled) {
                fetchPromises.push(fetchAndParseWetest(v4Url1));
            } else {
                fetchPromises.push(Promise.resolve([]));
            }
            if (ipv6Enabled) {
                fetchPromises.push(fetchAndParseWetest(v6Url1));
            } else {
                fetchPromises.push(Promise.resolve([]));
            }

            const [ipv4List, ipv6List] = await Promise.all(fetchPromises);
            results = [...ipv4List, ...ipv6List];

            // 按运营商筛选
            if (results.length > 0) {
                results = results.filter(item => {
                    const isp = item.isp || '';
                    if (isp.includes('移动') && !ispMobile) return false;
                    if (isp.includes('联通') && !ispUnicom) return false;
                    if (isp.includes('电信') && !ispTelecom) return false;
                    return true;
                });
            }

            if (results.length > 0) {
                return results;
            }
        } catch (e) {
        }
        return [];
    }

    async function fetchAndParseWetest(url) {
        try {
            const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            if (!response.ok) {
                return [];
            }
            const html = await response.text();
            const results = [];
            const rowRegex = /<tr[\s\S]*?<\/tr>/g;
            const cellRegex = /<td data-label="线路名称">(.+?)<\/td>[\s\S]*?<td data-label="优选地址">([\d.:a-fA-F]+)<\/td>[\s\S]*?<td data-label="数据中心">(.+?)<\/td>/;

            let match;
            while ((match = rowRegex.exec(html)) !== null) {
                const rowHtml = match[0];
                const cellMatch = rowHtml.match(cellRegex);
                if (cellMatch && cellMatch[1] && cellMatch[2]) {
                    const colo = cellMatch[3] ? cellMatch[3].trim().replace(/<.*?>/g, '') : '';
                    results.push({
                        isp: cellMatch[1].trim().replace(/<.*?>/g, ''),
                        ip: cellMatch[2].trim(),
                        colo: colo
                    });
                }
            }

            if (results.length === 0) {
            }

            return results;
        } catch (error) {
            return [];
        }
    }

    async function handleWsRequest(request) {
        // 从请求URL的path query中读取客户端自定义参数
        // p=ProxyIP, wk=Worker地区, rm=地区匹配(no关闭), s=socks5代理
        const reqUrl = new URL(request.url);
        const reqFallback = reqUrl.searchParams.get('p') || '';
        const reqRegion = (reqUrl.searchParams.get('wk') || '').toUpperCase();
        const reqRmStr = reqUrl.searchParams.get('rm') || '';
        const reqRm = reqRmStr ? reqRmStr.toLowerCase() !== 'no' : null;
        const reqSocksStr = reqUrl.searchParams.get('s') || '';
        let reqSocksConfig = null;
        if (reqSocksStr) {
            try { reqSocksConfig = parseSocksConfig(reqSocksStr); } catch (_) {}
        }

        // 检测并设置当前Worker地区，确保WebSocket请求能正确进行就近匹配
        // 优先级：客户端path参数wk > 全局manualWorkerRegion > 自动检测
        let effectiveRegion = currentWorkerRegion;
        if (!effectiveRegion || effectiveRegion === '') {
            if (reqRegion) {
                effectiveRegion = reqRegion;
            } else if (manualWorkerRegion && manualWorkerRegion.trim()) {
                effectiveRegion = manualWorkerRegion.trim().toUpperCase();
            } else {
                effectiveRegion = await detectWorkerRegion(request);
            }
        } else if (reqRegion) {
            effectiveRegion = reqRegion;
        }

        const wsPair = new WebSocketPair();
        const [clientSock, serverSock] = Object.values(wsPair);
        serverSock.accept();

        let remoteConnWrapper = { socket: null };
        let isDnsQuery = false;
        let protocolType = null; 

        const earlyData = request.headers.get(atob('c2VjLXdlYnNvY2tldC1wcm90b2NvbA==')) || '';
        const readable = makeReadableStream(serverSock, earlyData);

        readable.pipeTo(new WritableStream({
            async write(chunk) {
                if (isDnsQuery) return await forwardUDP(chunk, serverSock, null);
                if (remoteConnWrapper.socket) {
                    const writer = remoteConnWrapper.socket.writable.getWriter();
                    await writer.write(chunk);
                    writer.releaseLock();
                    return;
                }

                if (!protocolType) {
                    if (ev && chunk.byteLength >= 24) {
                        const vlessResult = parseWsPacketHeader(chunk, at);
                        if (!vlessResult.hasError) {
                            protocolType = 'vless';
                            const { addressType, port, hostname, rawIndex, version, isUDP } = vlessResult;
                if (isUDP) {
                    if (port === 53) isDnsQuery = true;
                    else throw new Error(E_UDP_DNS_ONLY);
                }
                const respHeader = new Uint8Array([version[0], 0]);
                const rawData = chunk.slice(rawIndex);
                if (isDnsQuery) return forwardUDP(rawData, serverSock, respHeader);
                    await forwardTCP(addressType, hostname, port, rawData, serverSock, respHeader, remoteConnWrapper, reqFallback, effectiveRegion, reqRm, reqSocksConfig);
                            return;
                        }
                    }

                    if (et && chunk.byteLength >= 56) {
                        const tjResult = await parseTrojanHeader(chunk, at);
                        if (!tjResult.hasError) {
                            protocolType = atob('dHJvamFu');
                            const { addressType, port, hostname, rawClientData } = tjResult;
                            await forwardTCP(addressType, hostname, port, rawClientData, serverSock, null, remoteConnWrapper, reqFallback, effectiveRegion, reqRm, reqSocksConfig);
                            return;
                        }
                    }

                    throw new Error('Invalid protocol or authentication failed');
                }
            },
        })).catch((err) => { });

        return new Response(null, { status: 101, webSocket: clientSock });
    }

    async function forwardTCP(addrType, host, portNum, rawData, ws, respHeader, remoteConnWrapper, reqFallback = '', reqRegion = '', reqRm = null, reqSocksConfig = null) {
        // 优先使用客户端path参数，其次回退到全局配置
        const effectiveFallback = reqFallback || fallbackAddress;
        const effectiveRegion = reqRegion || currentWorkerRegion;
        const effectiveRegionMatching = reqRm !== null ? reqRm : enableRegionMatching;
        const effectiveSocksConfig = reqSocksConfig || parsedSocks5Config;
        const effectiveSocksEnabled = reqSocksConfig ? true : isSocksEnabled;

        async function connectAndSend(address, port, useSocks = false) {
            const remoteSock = useSocks ?
                await establishSocksConnection(addrType, address, port, effectiveSocksConfig) :
                connect({ hostname: address, port: port });
            const writer = remoteSock.writable.getWriter();
            await writer.write(rawData);
            writer.releaseLock();
            return remoteSock;
        }

        async function retryConnection() {
            if (enableSocksDowngrade && effectiveSocksEnabled) {
                try {
                    const socksSocket = await connectAndSend(host, portNum, true);
                    remoteConnWrapper.socket = socksSocket;
                    socksSocket.closed.catch(() => {}).finally(() => closeSocketQuietly(ws));
                    connectStreams(socksSocket, ws, respHeader, null);
                    return;
                } catch (socksErr) {
                    let backupHost, backupPort;
                    if (effectiveFallback && effectiveFallback.trim()) {
                        const parsed = parseAddressAndPort(effectiveFallback);
                        backupHost = parsed.address;
                        backupPort = parsed.port || portNum;
                    } else {
                        const bestBackupIP = await getBestBackupIP(effectiveRegion, effectiveRegionMatching);
                        backupHost = bestBackupIP ? bestBackupIP.domain : host;
                        backupPort = bestBackupIP ? bestBackupIP.port : portNum;
                    }

                    try {
                        const fallbackSocket = await connectAndSend(backupHost, backupPort, false);
                        remoteConnWrapper.socket = fallbackSocket;
                        fallbackSocket.closed.catch(() => {}).finally(() => closeSocketQuietly(ws));
                        connectStreams(fallbackSocket, ws, respHeader, null);
                    } catch (fallbackErr) {
                        closeSocketQuietly(ws);
                    }
                }
            } else {
                let backupHost, backupPort;
                if (effectiveFallback && effectiveFallback.trim()) {
                    const parsed = parseAddressAndPort(effectiveFallback);
                    backupHost = parsed.address;
                    backupPort = parsed.port || portNum;
                } else {
                    const bestBackupIP = await getBestBackupIP(effectiveRegion, effectiveRegionMatching);
                    backupHost = bestBackupIP ? bestBackupIP.domain : host;
                    backupPort = bestBackupIP ? bestBackupIP.port : portNum;
                }

                try {
                    const fallbackSocket = await connectAndSend(backupHost, backupPort, effectiveSocksEnabled);
                    remoteConnWrapper.socket = fallbackSocket;
                    fallbackSocket.closed.catch(() => {}).finally(() => closeSocketQuietly(ws));
                    connectStreams(fallbackSocket, ws, respHeader, null);
                } catch (fallbackErr) {
                    closeSocketQuietly(ws);
                }
            }
        }
        
        try {
            const initialSocket = await connectAndSend(host, portNum, enableSocksDowngrade ? false : effectiveSocksEnabled);
            remoteConnWrapper.socket = initialSocket;
            connectStreams(initialSocket, ws, respHeader, retryConnection);
        } catch (err) {
            retryConnection();
        }
    }

    function parseWsPacketHeader(chunk, token) {
        if (chunk.byteLength < 24) return { hasError: true, message: E_INVALID_DATA };
        const version = new Uint8Array(chunk.slice(0, 1));
        if (formatIdentifier(new Uint8Array(chunk.slice(1, 17))) !== token) return { hasError: true, message: E_INVALID_USER };
        const optLen = new Uint8Array(chunk.slice(17, 18))[0];
        const cmd = new Uint8Array(chunk.slice(18 + optLen, 19 + optLen))[0];
        let isUDP = false;
        if (cmd === 1) {} else if (cmd === 2) { isUDP = true; } else { return { hasError: true, message: E_UNSUPPORTED_CMD }; }
        const portIdx = 19 + optLen;
        const port = new DataView(chunk.slice(portIdx, portIdx + 2)).getUint16(0);
        let addrIdx = portIdx + 2, addrLen = 0, addrValIdx = addrIdx + 1, hostname = '';
        const addressType = new Uint8Array(chunk.slice(addrIdx, addrValIdx))[0];
        switch (addressType) {
            case ADDRESS_TYPE_IPV4: addrLen = 4; hostname = new Uint8Array(chunk.slice(addrValIdx, addrValIdx + addrLen)).join('.'); break;
            case ADDRESS_TYPE_URL: addrLen = new Uint8Array(chunk.slice(addrValIdx, addrValIdx + 1))[0]; addrValIdx += 1; hostname = new TextDecoder().decode(chunk.slice(addrValIdx, addrValIdx + addrLen)); break;
            case ADDRESS_TYPE_IPV6: addrLen = 16; const ipv6 = []; const ipv6View = new DataView(chunk.slice(addrValIdx, addrValIdx + addrLen)); for (let i = 0; i < 8; i++) ipv6.push(ipv6View.getUint16(i * 2).toString(16)); hostname = ipv6.join(':'); break;
            default: return { hasError: true, message: `${E_INVALID_ADDR_TYPE}: ${addressType}` };
        }
        if (!hostname) return { hasError: true, message: `${E_EMPTY_ADDR}: ${addressType}` };
        return { hasError: false, addressType, port, hostname, isUDP, rawIndex: addrValIdx + addrLen, version };
    }

    function makeReadableStream(socket, earlyDataHeader) {
        let cancelled = false;
        return new ReadableStream({
            start(controller) {
                socket.addEventListener('message', (event) => { if (!cancelled) controller.enqueue(event.data); });
                socket.addEventListener('close', () => { if (!cancelled) { closeSocketQuietly(socket); controller.close(); } });
                socket.addEventListener('error', (err) => controller.error(err));
                const { earlyData, error } = base64ToArray(earlyDataHeader);
                if (error) controller.error(error); else if (earlyData) controller.enqueue(earlyData);
            },
            cancel() { cancelled = true; closeSocketQuietly(socket); }
        });
    }

    async function connectStreams(remoteSocket, webSocket, headerData, retryFunc) {
        let header = headerData, hasData = false;
        await remoteSocket.readable.pipeTo(
            new WritableStream({
                async write(chunk, controller) {
                    hasData = true;
                    if (webSocket.readyState !== 1) controller.error(E_WS_NOT_OPEN);
                    if (header) { webSocket.send(await new Blob([header, chunk]).arrayBuffer()); header = null; } 
                    else { webSocket.send(chunk); }
                },
                abort(reason) { },
            })
        ).catch((error) => { closeSocketQuietly(webSocket); });
        if (!hasData && retryFunc) retryFunc();
    }

    async function forwardUDP(udpChunk, webSocket, respHeader) {
        try {
            const tcpSocket = connect({ hostname: '8.8.4.4', port: 53 });
            let header = respHeader;
            const writer = tcpSocket.writable.getWriter();
            await writer.write(udpChunk);
            writer.releaseLock();
            await tcpSocket.readable.pipeTo(new WritableStream({
                async write(chunk) {
                    if (webSocket.readyState === 1) {
                        if (header) { webSocket.send(await new Blob([header, chunk]).arrayBuffer()); header = null; } 
                        else { webSocket.send(chunk); }
                    }
                },
            }));
        } catch (error) { }
    }

    async function establishSocksConnection(addrType, address, port, socksConfig = parsedSocks5Config) {
        const { username, password, hostname, socksPort } = socksConfig;
        const socket = connect({ hostname, port: socksPort });
        const writer = socket.writable.getWriter();
        await writer.write(new Uint8Array(username ? [5, 2, 0, 2] : [5, 1, 0]));
        const reader = socket.readable.getReader();
        let res = (await reader.read()).value;
        if (res[0] !== 5 || res[1] === 255) throw new Error(E_SOCKS_NO_METHOD);
        if (res[1] === 2) {
            if (!username || !password) throw new Error(E_SOCKS_AUTH_NEEDED);
            const encoder = new TextEncoder();
            const authRequest = new Uint8Array([1, username.length, ...encoder.encode(username), password.length, ...encoder.encode(password)]);
            await writer.write(authRequest);
            res = (await reader.read()).value;
            if (res[0] !== 1 || res[1] !== 0) throw new Error(E_SOCKS_AUTH_FAIL);
        }
        const encoder = new TextEncoder(); let DSTADDR;
        switch (addrType) {
            case ADDRESS_TYPE_IPV4: DSTADDR = new Uint8Array([1, ...address.split('.').map(Number)]); break;
            case ADDRESS_TYPE_URL: DSTADDR = new Uint8Array([3, address.length, ...encoder.encode(address)]); break;
            case ADDRESS_TYPE_IPV6: DSTADDR = new Uint8Array([4, ...address.split(':').flatMap(x => [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2), 16)])]); break;
            default: throw new Error(E_INVALID_ADDR_TYPE);
        }
        await writer.write(new Uint8Array([5, 1, 0, ...DSTADDR, port >> 8, port & 255]));
        res = (await reader.read()).value;
        if (res[1] !== 0) throw new Error(E_SOCKS_CONN_FAIL);
        writer.releaseLock(); reader.releaseLock();
        return socket;
    }

    function parseSocksConfig(address) {
        let [latter, former] = address.split("@").reverse(); 
        let username, password, hostname, socksPort;

        if (former) { 
            const formers = former.split(":"); 
            if (formers.length !== 2) throw new Error(E_INVALID_SOCKS_ADDR);
            [username, password] = formers; 
        }

        const latters = latter.split(":"); 
        socksPort = Number(latters.pop()); 
        if (isNaN(socksPort)) throw new Error(E_INVALID_SOCKS_ADDR);

        hostname = latters.join(":"); 
        if (hostname.includes(":") && !/^\[.*\]$/.test(hostname)) throw new Error(E_INVALID_SOCKS_ADDR);

        return { username, password, hostname, socksPort };
    }

   async function handleSubscriptionPage(request, user = null) {
    if (!user) user = at;

    const url = new URL(request.url);

    // ==================== 语言检测 ====================
    const cookieHeader = request.headers.get('Cookie') || '';
    let langFromCookie = null;
    if (cookieHeader) {
        const cookies = cookieHeader.split(';').map(c => c.trim());
        for (const cookie of cookies) {
            if (cookie.startsWith('preferredLanguage=')) {
                langFromCookie = cookie.split('=')[1];
                break;
            }
        }
    }

    let isFarsi = langFromCookie === 'fa' || langFromCookie === 'fa-IR';
    if (!langFromCookie) {
        const acceptLanguage = request.headers.get('Accept-Language') || '';
        const browserLang = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
        isFarsi = browserLang === 'fa' || acceptLanguage.includes('fa');
    }

    const langAttr = isFarsi ? 'fa-IR' : 'zh-CN';

    const translations = {
        zh: {
            title: '订阅中心',
            subtitle: '多客户端支持 • 智能优选 • 一键生成',
            specifyRegion: '指定地区 (wk):',
            autoDetect: '自动检测',
            saveConfig: '保存配置',
            // 其他翻译保持你原来的即可
        },
        fa: { /* 可保持原有 */ }
    };

    const t = isFarsi ? translations.fa : translations.zh;

    // ==================== 多选地区 HTML ====================
    const regionOptions = `
        <option value="">自动检测（推荐）</option>
        <option value="SG">🇸🇬 新加坡</option>
        <option value="JP">🇯🇵 日本</option>
        <option value="US">🇺🇸 美国</option>
        <option value="KR">🇰🇷 韩国</option>
        <option value="HK">🇭🇰 香港</option>
        <option value="DE">🇩🇪 德国</option>
        <option value="GB">🇬🇧 英国</option>
        <option value="NL">🇳🇱 荷兰</option>
        <option value="SE">🇸🇪 瑞典</option>
        <option value="FI">🇫🇮 芬兰</option>
        <option value="Oracle">甲骨文 Oracle</option>
        <option value="DigitalOcean">数码海 DigitalOcean</option>
        <option value="Vultr">Vultr</option>
        <option value="Multacom">Multacom</option>
    `;

    // ==================== 完整页面 HTML（核心修改部分） ====================
    const pageHtml = `<!DOCTYPE html>
<html lang="${langAttr}" dir="${isFarsi ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t.title}</title>
    <style>
        /* ==================== 你原来的所有 CSS 样式保持不变 ==================== */
        /* ... 请把你文件里原有的 <style> 内容完整复制到这里 ... */
    </style>
</head>
<body>
    <!-- 你原来的页面结构（header、terminal 等）保持不变 -->

    <!-- ==================== 多选地区表单 ==================== -->
    <div class="form-group">
        <label>${t.specifyRegion}</label>
        <select id="wkRegion" multiple size="10" style="width:100%; min-height:260px; background:rgba(0,20,0,0.95); color:#00ff00; border:2px solid #00aa00; padding:8px; font-family:monospace; font-size:14px;">
            ${regionOptions}
        </select>
        <small style="color:#00cc00; display:block; margin-top:6px;">
            💡 按住 Ctrl（Windows）或 Command（Mac）键可多选，顺序决定优先级
        </small>
    </div>

    <!-- 其他表单（customIP、yx、协议等）保持你原来的代码 -->

    <script>
        // ==================== 多选加载与保存逻辑 ====================
        async function loadCurrentConfig() {
            // ... 你原来的加载代码 ...

            const wkSelect = document.getElementById('wkRegion');
            if (wkSelect) {
                const currentWk = getConfigValue('wk', '');
                const selected = currentWk ? currentWk.split(',').map(r => r.trim().toUpperCase()) : [];
                Array.from(wkSelect.options).forEach(opt => {
                    opt.selected = selected.includes(opt.value);
                });
            }
            updateWkRegionState();
        }

        // 保存地区（多选）
        const regionForm = document.getElementById('regionForm');
        if (regionForm) {
            regionForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                const wkSelect = document.getElementById('wkRegion');
                const selectedValues = Array.from(wkSelect.selectedOptions)
                    .map(option => option.value)
                    .filter(v => v !== '')
                    .join(',');
                await saveConfig({ wk: selectedValues });
            });
        }

        function updateWkRegionState() {
            const customIPInput = document.getElementById('customIP');
            const wkRegion = document.getElementById('wkRegion');
            if (customIPInput && wkRegion) {
                const hasCustomIP = customIPInput.value.trim() !== '';
                wkRegion.disabled = hasCustomIP;
                wkRegion.style.opacity = hasCustomIP ? '0.5' : '1';
            }
        }

        // DOMContentLoaded
        document.addEventListener('DOMContentLoaded', function() {
            createMatrixRain();
            checkSystemStatus();
            checkKVStatus();
            checkECHStatus();
            loadCurrentConfig();

            const customIPInput = document.getElementById('customIP');
            if (customIPInput) customIPInput.addEventListener('input', updateWkRegionState);

            // ... 你原来的其他按钮事件绑定代码保持不变 ...
        });
    </script>
</body>
</html>`;

    return new Response(pageHtml, { 
        status: 200, 
        headers: { 'Content-Type': 'text/html; charset=utf-8' } 
    });
}

    async function parseTrojanHeader(buffer, ut) {
        const passwordToHash = tp || ut;
        const sha224Password = await sha224Hash(passwordToHash);

        if (buffer.byteLength < 56) {
            return {
                hasError: true,
                message: "invalid " + atob('dHJvamFu') + " data - too short"
            };
        }
        let crLfIndex = 56;
        if (new Uint8Array(buffer.slice(56, 57))[0] !== 0x0d || new Uint8Array(buffer.slice(57, 58))[0] !== 0x0a) {
            return {
                hasError: true,
                message: "invalid " + atob('dHJvamFu') + " header format (missing CR LF)"
            };
        }
        const password = new TextDecoder().decode(buffer.slice(0, crLfIndex));
        if (password !== sha224Password) {
            return {
                hasError: true,
                message: "invalid " + atob('dHJvamFu') + " password"
            };
        }

        const socks5DataBuffer = buffer.slice(crLfIndex + 2);
        if (socks5DataBuffer.byteLength < 6) {
            return {
                hasError: true,
                message: atob('aW52YWxpZCBTT0NLUzUgcmVxdWVzdCBkYXRh')
            };
        }

        const view = new DataView(socks5DataBuffer);
        const cmd = view.getUint8(0);
        if (cmd !== 1) {
            return {
                hasError: true,
                message: "unsupported command, only TCP (CONNECT) is allowed"
            };
        }

        const atype = view.getUint8(1);
        let addressLength = 0;
        let addressIndex = 2;
        let address = "";
        switch (atype) {
            case 1:
                addressLength = 4;
                address = new Uint8Array(
                socks5DataBuffer.slice(addressIndex, addressIndex + addressLength)
                ).join(".");
                break;
            case 3:
                addressLength = new Uint8Array(
                socks5DataBuffer.slice(addressIndex, addressIndex + 1)
                )[0];
                addressIndex += 1;
                address = new TextDecoder().decode(
                socks5DataBuffer.slice(addressIndex, addressIndex + addressLength)
                );
                break;
            case 4:
                addressLength = 16;
                const dataView = new DataView(socks5DataBuffer.slice(addressIndex, addressIndex + addressLength));
                const ipv6 = [];
                for (let i = 0; i < 8; i++) {
                    ipv6.push(dataView.getUint16(i * 2).toString(16));
                }
                address = ipv6.join(":");
                break;
            default:
                return {
                    hasError: true,
                    message: `invalid addressType is ${atype}`
                };
        }

        if (!address) {
            return {
                hasError: true,
                message: `address is empty, addressType is ${atype}`
            };
        }

        const portIndex = addressIndex + addressLength;
        const portBuffer = socks5DataBuffer.slice(portIndex, portIndex + 2);
        const portRemote = new DataView(portBuffer).getUint16(0);

        return {
            hasError: false,
            addressRemote: address,
            addressType: atype,
            port: portRemote,
            hostname: address,
            rawClientData: socks5DataBuffer.slice(portIndex + 4)
        };
    }

    async function sha224Hash(text) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);

        const K = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        ];

        let H = [
            0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
            0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
        ];

        const msgLen = data.length;
        const bitLen = msgLen * 8;
        const paddedLen = Math.ceil((msgLen + 9) / 64) * 64;
        const padded = new Uint8Array(paddedLen);
        padded.set(data);
        padded[msgLen] = 0x80;

        const view = new DataView(padded.buffer);
        view.setUint32(paddedLen - 4, bitLen, false);

        for (let chunk = 0; chunk < paddedLen; chunk += 64) {
            const W = new Uint32Array(64);

            for (let i = 0; i < 16; i++) {
                W[i] = view.getUint32(chunk + i * 4, false);
            }

            for (let i = 16; i < 64; i++) {
                const s0 = rightRotate(W[i - 15], 7) ^ rightRotate(W[i - 15], 18) ^ (W[i - 15] >>> 3);
                const s1 = rightRotate(W[i - 2], 17) ^ rightRotate(W[i - 2], 19) ^ (W[i - 2] >>> 10);
                W[i] = (W[i - 16] + s0 + W[i - 7] + s1) >>> 0;
            }

            let [a, b, c, d, e, f, g, h] = H;

            for (let i = 0; i < 64; i++) {
                const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
                const ch = (e & f) ^ (~e & g);
                const temp1 = (h + S1 + ch + K[i] + W[i]) >>> 0;
                const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
                const maj = (a & b) ^ (a & c) ^ (b & c);
                const temp2 = (S0 + maj) >>> 0;

                h = g;
                g = f;
                f = e;
                e = (d + temp1) >>> 0;
                d = c;
                c = b;
                b = a;
                a = (temp1 + temp2) >>> 0;
            }

            H[0] = (H[0] + a) >>> 0;
            H[1] = (H[1] + b) >>> 0;
            H[2] = (H[2] + c) >>> 0;
            H[3] = (H[3] + d) >>> 0;
            H[4] = (H[4] + e) >>> 0;
            H[5] = (H[5] + f) >>> 0;
            H[6] = (H[6] + g) >>> 0;
            H[7] = (H[7] + h) >>> 0;
        }

        const result = [];
        for (let i = 0; i < 7; i++) {
            result.push(
                ((H[i] >>> 24) & 0xff).toString(16).padStart(2, '0'),
                ((H[i] >>> 16) & 0xff).toString(16).padStart(2, '0'),
                ((H[i] >>> 8) & 0xff).toString(16).padStart(2, '0'),
                (H[i] & 0xff).toString(16).padStart(2, '0')
            );
        }

        return result.join('');
    }

    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    }

    let ACTIVE_CONNECTIONS = 0;
    const XHTTP_BUFFER_SIZE = 128 * 1024;
    const CONNECT_TIMEOUT_MS = 5000;
    const IDLE_TIMEOUT_MS = 45000;
    const MAX_RETRIES = 2;
    const MAX_CONCURRENT = 32;

    function xhttp_sleep(ms) {
        return new Promise((r) => setTimeout(r, ms));
    }

    function validate_uuid_xhttp(id, uuid) {
        for (let index = 0; index < 16; index++) {
            if (id[index] !== uuid[index]) {
                return false;
            }
        }
        return true;
    }

    class XhttpCounter {
        #total

        constructor() {
            this.#total = 0;
        }

        get() {
            return this.#total;
        }

        add(size) {
            this.#total += size;
        }
    }

    function concat_typed_arrays(first, ...args) {
        let len = first.length;
        for (let a of args) {
            len += a.length;
        }
        const r = new first.constructor(len);
        r.set(first, 0);
        len = first.length;
        for (let a of args) {
            r.set(a, len);
            len += a.length;
        }
        return r;
    }

    function parse_uuid_xhttp(uuid) {
        uuid = uuid.replaceAll('-', '');
        const r = [];
        for (let index = 0; index < 16; index++) {
            const v = parseInt(uuid.substr(index * 2, 2), 16);
            r.push(v);
        }
        return r;
    }

    function get_xhttp_buffer(size) {
        return new Uint8Array(new ArrayBuffer(size || XHTTP_BUFFER_SIZE));
    }

    async function read_xhttp_header(readable, uuid_str) {
        const reader = readable.getReader({ mode: 'byob' });

        try {
            let r = await reader.readAtLeast(1 + 16 + 1, get_xhttp_buffer());
            let rlen = 0;
            let idx = 0;
            let cache = r.value;
            rlen += r.value.length;

            const version = cache[0];
            const id = cache.slice(1, 1 + 16);
            const uuid = parse_uuid_xhttp(uuid_str);
            if (!validate_uuid_xhttp(id, uuid)) {
                return `invalid UUID`;
            }
            const pb_len = cache[1 + 16];
            const addr_plus1 = 1 + 16 + 1 + pb_len + 1 + 2 + 1;

            if (addr_plus1 + 1 > rlen) {
                if (r.done) {
                    return `header too short`;
                }
                idx = addr_plus1 + 1 - rlen;
                r = await reader.readAtLeast(idx, get_xhttp_buffer());
                rlen += r.value.length;
                cache = concat_typed_arrays(cache, r.value);
            }

            const cmd = cache[1 + 16 + 1 + pb_len];
            if (cmd !== 1) {
                return `unsupported command: ${cmd}`;
            }
            const port = (cache[addr_plus1 - 1 - 2] << 8) + cache[addr_plus1 - 1 - 1];
            const atype = cache[addr_plus1 - 1];
            let header_len = -1;
            if (atype === ADDRESS_TYPE_IPV4) {
                header_len = addr_plus1 + 4;
            } else if (atype === ADDRESS_TYPE_IPV6) {
                header_len = addr_plus1 + 16;
            } else if (atype === ADDRESS_TYPE_URL) {
                header_len = addr_plus1 + 1 + cache[addr_plus1];
            }

            if (header_len < 0) {
                return 'read address type failed';
            }

            idx = header_len - rlen;
            if (idx > 0) {
                if (r.done) {
                    return `read address failed`;
                }
                r = await reader.readAtLeast(idx, get_xhttp_buffer());
                rlen += r.value.length;
                cache = concat_typed_arrays(cache, r.value);
            }

            let hostname = '';
            idx = addr_plus1;
            switch (atype) {
                case ADDRESS_TYPE_IPV4:
                    hostname = cache.slice(idx, idx + 4).join('.');
                    break;
                case ADDRESS_TYPE_URL:
                    hostname = new TextDecoder().decode(
                        cache.slice(idx + 1, idx + 1 + cache[idx]),
                    );
                    break;
                case ADDRESS_TYPE_IPV6:
                    hostname = cache
                        .slice(idx, idx + 16)
                        .reduce(
                            (s, b2, i2, a) =>
                                i2 % 2
                                    ? s.concat(((a[i2 - 1] << 8) + b2).toString(16))
                                    : s,
                            [],
                        )
                        .join(':');
                    break;
            }

            if (hostname.length < 1) {
                return 'failed to parse hostname';
            }

            const data = cache.slice(header_len);
            return {
                hostname,
                port,
                data,
                resp: new Uint8Array([version, 0]),
                reader,
                done: r.done,
            };
        } catch (error) {
            try { reader.releaseLock(); } catch (_) {}
            throw error;
        }
    }

    async function upload_to_remote_xhttp(counter, writer, httpx) {
        async function inner_upload(d) {
            if (!d || d.length === 0) {
                return;
            }
            counter.add(d.length);
            try {
                await writer.write(d);
            } catch (error) {
                throw error;
            }
        }

        try {
            await inner_upload(httpx.data);
            let chunkCount = 0;
            while (!httpx.done) {
                const r = await httpx.reader.read(get_xhttp_buffer());
                if (r.done) break;
                await inner_upload(r.value);
                httpx.done = r.done;
                chunkCount++;
                if (chunkCount % 10 === 0) {
                    await xhttp_sleep(0);
                }
                if (!r.value || r.value.length === 0) {
                    await xhttp_sleep(2);
                }
            }
        } catch (error) {
            throw error;
        }
    }

    function create_xhttp_uploader(httpx, writable) {
        const counter = new XhttpCounter();
        const writer = writable.getWriter();

        const done = (async () => {
            try {
                await upload_to_remote_xhttp(counter, writer, httpx);
            } catch (error) {
                throw error;
            } finally {
                try {
                    await writer.close();
                } catch (error) {
                    
                }
            }
        })();

        return {
            counter,
            done,
            abort: () => {
                try { writer.abort(); } catch (_) {}
            }
        };
    }

    function create_xhttp_downloader(resp, remote_readable) {
        const counter = new XhttpCounter();
        let stream;

        const done = new Promise((resolve, reject) => {
            stream = new TransformStream(
                {
                    start(controller) {
                        counter.add(resp.length);
                        controller.enqueue(resp);
                    },
                    transform(chunk, controller) {
                        counter.add(chunk.length);
                        controller.enqueue(chunk);
                    },
                    cancel(reason) {
                        reject(`download cancelled: ${reason}`);
                    },
                },
                null,
                new ByteLengthQueuingStrategy({ highWaterMark: XHTTP_BUFFER_SIZE }),
            );

            let lastActivity = Date.now();
            const idleTimer = setInterval(() => {
                if (Date.now() - lastActivity > IDLE_TIMEOUT_MS) {
                    try {
                        stream.writable.abort?.('idle timeout');
                    } catch (_) {}
                    clearInterval(idleTimer);
                    reject('idle timeout');
                }
            }, 5000);

            const reader = remote_readable.getReader();
            const writer = stream.writable.getWriter();

            ;(async () => {
                try {
                    let chunkCount = 0;
                    while (true) {
                        const r = await reader.read();
                        if (r.done) {
                            break;
                        }
                        lastActivity = Date.now();
                        await writer.write(r.value);
                        chunkCount++;
                        if (chunkCount % 5 === 0) {
                            await xhttp_sleep(0);
                        }
                    }
                    await writer.close();
                    resolve();
                } catch (err) {
                    reject(err);
                } finally {
                    try { 
                        reader.releaseLock(); 
                    } catch (_) {}
                    try { 
                        writer.releaseLock(); 
                    } catch (_) {}
                    clearInterval(idleTimer);
                }
            })();
        });

        return {
            readable: stream.readable,
            counter,
            done,
            abort: () => {
                try { stream.readable.cancel(); } catch (_) {}
                try { stream.writable.abort(); } catch (_) {}
            }
        };
    }

    async function connect_to_remote_xhttp(httpx, ...remotes) {
        let attempt = 0;
        let lastErr;

        const connectionList = [httpx.hostname, ...remotes.filter(r => r && r !== httpx.hostname)];

        for (const hostname of connectionList) {
            if (!hostname) continue;

            attempt = 0;
            while (attempt < MAX_RETRIES) {
                attempt++;
                try {
                    const remote = connect({ hostname, port: httpx.port });
                    const timeoutPromise = xhttp_sleep(CONNECT_TIMEOUT_MS).then(() => {
                        throw new Error(atob('Y29ubmVjdCB0aW1lb3V0'));
                    });

                    await Promise.race([remote.opened, timeoutPromise]);

                    const uploader = create_xhttp_uploader(httpx, remote.writable);
                    const downloader = create_xhttp_downloader(httpx.resp, remote.readable);

                    return { 
                        downloader, 
                        uploader,
                        close: () => {
                            try { remote.close(); } catch (_) {}
                        }
                    };
                } catch (err) {
                    lastErr = err;
                    if (attempt < MAX_RETRIES) {
                        await xhttp_sleep(500 * attempt);
                    }
                }
            }
        }

        return null;
    }

    async function handle_xhttp_client(body, uuid) {
        if (ACTIVE_CONNECTIONS >= MAX_CONCURRENT) {
            return new Response('Too many connections', { status: 429 });
        }

        ACTIVE_CONNECTIONS++;
        
        let cleaned = false;
        const cleanup = () => {
            if (!cleaned) {
                ACTIVE_CONNECTIONS = Math.max(0, ACTIVE_CONNECTIONS - 1);
                cleaned = true;
            }
        };

        try {
            const httpx = await read_xhttp_header(body, uuid);
            if (typeof httpx !== 'object' || !httpx) {
                return null;
            }

            const remoteConnection = await connect_to_remote_xhttp(httpx, fallbackAddress, '13.230.34.30');
            if (remoteConnection === null) {
                return null;
            }

            const connectionClosed = Promise.race([
                (async () => {
                    try {
                        await remoteConnection.downloader.done;
                    } catch (err) {
                        
                    }
                })(),
                (async () => {
                    try {
                        await remoteConnection.uploader.done;
                    } catch (err) {
                        
                    }
                })(),
                xhttp_sleep(IDLE_TIMEOUT_MS).then(() => {
                    
                })
            ]).finally(() => {
                try { remoteConnection.close(); } catch (_) {}
                try { remoteConnection.downloader.abort(); } catch (_) {}
                try { remoteConnection.uploader.abort(); } catch (_) {}
                
                cleanup();
            });

            return {
                readable: remoteConnection.downloader.readable,
                closed: connectionClosed
            };
        } catch (error) {
            cleanup();
            return null;
        }
    }

    async function handleXhttpPost(request) {
        try {
            return await handle_xhttp_client(request.body, at);
        } catch (err) {
            return null;
        }
    }

    function base64ToArray(b64Str) {
        if (!b64Str) return { error: null };
        try { b64Str = b64Str.replace(/-/g, '+').replace(/_/g, '/'); return { earlyData: Uint8Array.from(atob(b64Str), (c) => c.charCodeAt(0)).buffer, error: null }; } 
        catch (error) { return { error }; }
    }

    function closeSocketQuietly(socket) { try { if (socket.readyState === 1 || socket.readyState === 2) socket.close(); } catch (error) {} }

    const hexTable = Array.from({ length: 256 }, (v, i) => (i + 256).toString(16).slice(1));
    function formatIdentifier(arr, offset = 0) {
        const id = (hexTable[arr[offset]]+hexTable[arr[offset+1]]+hexTable[arr[offset+2]]+hexTable[arr[offset+3]]+"-"+hexTable[arr[offset+4]]+hexTable[arr[offset+5]]+"-"+hexTable[arr[offset+6]]+hexTable[arr[offset+7]]+"-"+hexTable[arr[offset+8]]+hexTable[arr[offset+9]]+"-"+hexTable[arr[offset+10]]+hexTable[arr[offset+11]]+hexTable[arr[offset+12]]+hexTable[arr[offset+13]]+hexTable[arr[offset+14]]+hexTable[arr[offset+15]]).toLowerCase();
        if (!isValidFormat(id)) throw new TypeError(E_INVALID_ID_STR);
        return id;
    }

    async function fetchAndParseNewIPs() {
        const url = piu;
        try {
            const urls = url.includes(',') ? url.split(',').map(u => u.trim()).filter(u => u) : [url];
            const apiResults = await fetchPreferredAPI(urls, '443', 5000);

            if (apiResults.length > 0) {
                const results = [];
                const regex = /^(\[[\da-fA-F:]+\]|[\d.]+|[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*)(?::(\d+))?(?:#(.+))?$/;
                
                for (const item of apiResults) {
                    const match = item.match(regex);
                    if (match) {
                        results.push({
                            ip: match[1],
                            port: parseInt(match[2] || '443', 10),
                            name: match[3]?.trim() || match[1]
                        });
                    }
                }
                return results;
            }

            const response = await fetch(url);
            if (!response.ok) return [];
            const text = await response.text();
            const results = [];
            const lines = text.trim().replace(/\r/g, "").split('\n');
            const simpleRegex = /^([^:]+):(\d+)#(.*)$/;

            for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine) continue;
                const match = trimmedLine.match(simpleRegex);
                if (match) {
                    results.push({
                        ip: match[1],
                        port: parseInt(match[2], 10),
                        name: match[3].trim() || match[1]
                    });
                }
            }
            return results;
        } catch (error) {
            return [];
        }
    }

    function generateLinksFromNewIPs(list, user, workerDomain, echConfig = null, skipNumbering = false) {
        const CF_HTTP_PORTS = [80, 8080, 8880, 2052, 2082, 2086, 2095];
        const CF_HTTPS_PORTS = [443, 2053, 2083, 2087, 2096, 8443];
        const links = [];
        const wsPath = '/?ed=2048';
        const proto = atob('dmxlc3M=');

        const { namer, setSkipNumbering } = createNodeNamer(skipNumbering);

        for (const item of list) {
            const nodeNameBase = item.name.replace(/\s/g, '_');
            const port = item.port;
            const safeIP = item.ip.includes(':') ? `[${item.ip}]` : item.ip;

            const getNodeName = (suffix) => {
                const nodeName = `${nodeNameBase}-${port}${suffix}`;
                if (skipNumbering) return nodeName;
                return namer(nodeNameBase, nodeName);
            };

            if (CF_HTTPS_PORTS.includes(port)) {
                const suffix = '-WS-TLS';
                const wsNodeName = getNodeName(suffix);
                let link = `${proto}://${user}@${safeIP}:${port}?encryption=none&security=tls&sni=${workerDomain}&fp=${enableECH ? 'chrome' : 'randomized'}&type=ws&host=${workerDomain}&path=${wsPath}`;

                // 如果启用了ECH，添加ech参数（ECH需要伪装成Chrome浏览器）
                if (enableECH) {
                    const dnsServer = customDNS || 'https://223.5.5.5/dns-query';
                    const echDomain = customECHDomain || 'cloudflare-ech.com';
                    link += `&alpn=h3&ech=${encodeURIComponent(`${echDomain}+${dnsServer}`)}`;
                }

                link += `#${encodeURIComponent(wsNodeName)}`;
                links.push(link);
            } else if (CF_HTTP_PORTS.includes(port)) {
                if (!disableNonTLS) {
                    const suffix = '-WS';
                    const wsNodeName = getNodeName(suffix);
                    const link = `${proto}://${user}@${safeIP}:${port}?encryption=none&security=none&type=ws&host=${workerDomain}&path=${wsPath}#${encodeURIComponent(wsNodeName)}`;
                    links.push(link);
                }
            } else {
                const suffix = '-WS-TLS';
                const wsNodeName = getNodeName(suffix);
                let link = `${proto}://${user}@${safeIP}:${port}?encryption=none&security=tls&sni=${workerDomain}&fp=${enableECH ? 'chrome' : 'randomized'}&type=ws&host=${workerDomain}&path=${wsPath}`;

                // 如果启用了ECH，添加ech参数（ECH需要伪装成Chrome浏览器）
                if (enableECH) {
                    const dnsServer = customDNS || 'https://223.5.5.5/dns-query';
                    const echDomain = customECHDomain || 'cloudflare-ech.com';
                    link += `&alpn=h3&ech=${encodeURIComponent(`${echDomain}+${dnsServer}`)}`;
                }

                link += `#${encodeURIComponent(wsNodeName)}`;
                links.push(link);
            }
        }
        return links;
    }

    function generateXhttpLinksFromSource(list, user, workerDomain, echConfig = null, skipNumbering = false) {
        const links = [];
        const nodePath = user.substring(0, 8);

        const { namer, setSkipNumbering } = createNodeNamer(skipNumbering);

        for (const item of list) {
            let nodeNameBase = item.isp || item.name || item.ip;
            if (!nodeNameBase) continue;
            nodeNameBase = nodeNameBase.replace(/\s/g, '_');
            if (item.colo) nodeNameBase = `${nodeNameBase}-${item.colo}`;
            const safeIP = item.ip.includes(':') ? `[${item.ip}]` : item.ip;
            const port = item.port || 443;

            const getNodeName = (suffix) => {
                const nodeName = `${nodeNameBase}-${port}${suffix}`;
                if (skipNumbering) return nodeName;
                return namer(nodeNameBase, nodeName);
            };

            const suffix = '-xhttp';
            const wsNodeName = getNodeName(suffix);

            const params = new URLSearchParams({
                encryption: 'none',
                security: 'tls',
                sni: workerDomain,
                fp: 'chrome',
                type: 'xhttp',
                host: workerDomain,
                path: `/${nodePath}`,
                mode: 'stream-one'
            });

            if (enableECH) {
                const dnsServer = customDNS || 'https://223.5.5.5/dns-query';
                const echDomain = customECHDomain || 'cloudflare-ech.com';
                params.set('alpn', 'h3,h2');
                params.set('ech', `${echDomain}+${dnsServer}`);
            }

            links.push(`vless://${user}@${safeIP}:${port}?${params.toString()}#${encodeURIComponent(wsNodeName)}`);
        }
        return links;
    }

    async function generateTrojanLinksFromNewIPs(list, user, workerDomain, echConfig = null, skipNumbering = false) {
        const CF_HTTP_PORTS = [80, 8080, 8880, 2052, 2082, 2086, 2095];
        const CF_HTTPS_PORTS = [443, 2053, 2083, 2087, 2096, 8443];

        const links = [];
        const wsPath = '/?ed=2048';

        const password = tp || user;

        const { namer, setSkipNumbering } = createNodeNamer(skipNumbering);

        for (const item of list) {
            const nodeNameBase = item.name.replace(/\s/g, '_');
            const port = item.port;
            const safeIP = item.ip.includes(':') ? `[${item.ip}]` : item.ip;

            const getNodeName = (suffix) => {
                const nodeName = `${nodeNameBase}-${port}${suffix}`;
                if (skipNumbering) return nodeName;
                return namer(nodeNameBase, nodeName);
            };

            if (CF_HTTPS_PORTS.includes(port)) {
                const suffix = `-${atob('VHJvamFu')}-WS-TLS`;
                const wsNodeName = getNodeName(suffix);
                let link = `${atob('dHJvamFuOi8v')}${password}@${safeIP}:${port}?security=tls&sni=${workerDomain}&fp=chrome&type=ws&host=${workerDomain}&path=${wsPath}`;

                // 如果启用了ECH，添加ech参数（ECH需要伪装成Chrome浏览器）
                if (enableECH) {
                    const dnsServer = customDNS || 'https://223.5.5.5/dns-query';
                    const echDomain = customECHDomain || 'cloudflare-ech.com';
                    link += `&alpn=h3&ech=${encodeURIComponent(`${echDomain}+${dnsServer}`)}`;
                }

                link += `#${encodeURIComponent(wsNodeName)}`;
                links.push(link);
            } else if (CF_HTTP_PORTS.includes(port)) {
                if (!disableNonTLS) {
                    const suffix = `-${atob('VHJvamFu')}-WS`;
                    const wsNodeName = getNodeName(suffix);
                    const link = `${atob('dHJvamFuOi8v')}${password}@${safeIP}:${port}?security=none&type=ws&host=${workerDomain}&path=${wsPath}#${encodeURIComponent(wsNodeName)}`;
                    links.push(link);
                }
            } else {
                const suffix = `-${atob('VHJvamFu')}-WS-TLS`;
                const wsNodeName = getNodeName(suffix);
                let link = `${atob('dHJvamFuOi8v')}${password}@${safeIP}:${port}?security=tls&sni=${workerDomain}&fp=chrome&type=ws&host=${workerDomain}&path=${wsPath}`;

                // 如果启用了ECH，添加ech参数（ECH需要伪装成Chrome浏览器）
                if (enableECH) {
                    const dnsServer = customDNS || 'https://223.5.5.5/dns-query';
                    const echDomain = customECHDomain || 'cloudflare-ech.com';
                    link += `&alpn=h3&ech=${encodeURIComponent(`${echDomain}+${dnsServer}`)}`;
                }
                link += `#${encodeURIComponent(wsNodeName)}`;
                links.push(link);
            }
        }
        return links;
    }

    async function handleConfigAPI(request) {
        if (request.method === 'GET') {

            if (!kvStore) {
                return new Response(JSON.stringify({
                    error: 'KV存储未配置',
                    kvEnabled: false
                }), {
                    status: 503,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            return new Response(JSON.stringify({
                ...kvConfig,
                kvEnabled: true
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        } else if (request.method === 'POST') {
            
            if (!kvStore) {
                return new Response(JSON.stringify({
                    success: false,
                    message: 'KV存储未配置，无法保存配置'
                }), {
                    status: 503,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            try {
                const newConfig = await request.json();
                
                for (const [key, value] of Object.entries(newConfig)) {
                    if (value === '' || value === null || value === undefined) {
                        delete kvConfig[key];
                    } else {
                        kvConfig[key] = value;
                    }
                }

                await saveKVConfig();

                updateConfigVariables();
                
                if (newConfig.yx !== undefined) {
                    updateCustomPreferredFromYx();
                }

                return new Response(JSON.stringify({
                    success: true,
                    message: '配置已保存',
                    config: kvConfig
                }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                return new Response(JSON.stringify({
                    success: false,
                    message: '保存配置失败: ' + error.message
                }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    async function handlePreferredIPsAPI(request) {
        if (!kvStore) {
            return new Response(JSON.stringify({
                success: false,
                error: 'KV存储未配置',
                message: '需要配置KV存储才能使用此功能'
            }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const ae = getConfigValue('ae', '') === 'yes';
        if (!ae) {
            return new Response(JSON.stringify({
                success: false,
                error: 'API功能未启用',
                message: '出于安全考虑，优选IP API功能默认关闭。请在配置管理页面开启"允许API管理"选项后使用。'
            }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        try {
            if (request.method === 'GET') {
                
                const yxValue = getConfigValue('yx', '');
                const pi = parseYxToArray(yxValue);
                
                return new Response(JSON.stringify({
                    success: true,
                    count: pi.length,
                    data: pi
                }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            } else if (request.method === 'POST') {
                const body = await request.json();
                const ipsToAdd = Array.isArray(body) ? body : [body];

                if (ipsToAdd.length === 0) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: '请求数据为空',
                        message: '请提供IP数据'
                    }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }

                const yxValue = getConfigValue('yx', '');
                let pi = parseYxToArray(yxValue);

                const addedIPs = [];
                const skippedIPs = [];
                const errors = [];

                for (const item of ipsToAdd) {
                    if (!item.ip) {
                        errors.push({ ip: '未知', reason: 'IP地址是必需的' });
                        continue;
                    }

                    const port = item.port || 443;
                    const name = item.name || `API优选-${item.ip}:${port}`;

                    if (!isValidIP(item.ip) && !isValidDomain(item.ip)) {
                        errors.push({ ip: item.ip, reason: '无效的IP或域名格式' });
                        continue;
                    }

                    const exists = pi.some(existItem => 
                        existItem.ip === item.ip && existItem.port === port
                    );

                    if (exists) {
                        skippedIPs.push({ ip: item.ip, port: port, reason: '已存在' });
                        continue;
                    }

                    const newIP = {
                        ip: item.ip,
                        port: port,
                        name: name,
                        addedAt: new Date().toISOString()
                    };

                    pi.push(newIP);
                    addedIPs.push(newIP);
                }

                if (addedIPs.length > 0) {
                    const newYxValue = arrayToYx(pi);
                    await setConfigValue('yx', newYxValue);
                    updateCustomPreferredFromYx();
                }

                return new Response(JSON.stringify({
                    success: addedIPs.length > 0,
                    message: `成功添加 ${addedIPs.length} 个IP`,
                    added: addedIPs.length,
                    skipped: skippedIPs.length,
                    errors: errors.length,
                    data: {
                        addedIPs: addedIPs,
                        skippedIPs: skippedIPs.length > 0 ? skippedIPs : undefined,
                        errors: errors.length > 0 ? errors : undefined
                    }
                }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            } else if (request.method === 'DELETE') {
                const body = await request.json();

                if (body.all === true) {
                    const yxValue = getConfigValue('yx', '');
                    const pi = parseYxToArray(yxValue);
                    const deletedCount = pi.length;

                    await setConfigValue('yx', '');
                    updateCustomPreferredFromYx();

                    return new Response(JSON.stringify({
                        success: true,
                        message: `已清空所有优选IP，共删除 ${deletedCount} 个`,
                        deletedCount: deletedCount
                    }), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                }

                if (!body.ip) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'IP地址是必需的',
                        message: '请提供要删除的ip字段，或使用 {"all": true} 清空所有'
                    }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }

                const port = body.port || 443;

                const yxValue = getConfigValue('yx', '');
                let pi = parseYxToArray(yxValue);
                const initialLength = pi.length;

                const filteredIPs = pi.filter(item => 
                    !(item.ip === body.ip && item.port === port)
                );

                if (filteredIPs.length === initialLength) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: '优选IP不存在',
                        message: `${body.ip}:${port} 未找到`
                    }), {
                        status: 404,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }

                const newYxValue = arrayToYx(filteredIPs);
                await setConfigValue('yx', newYxValue);
                updateCustomPreferredFromYx();

                return new Response(JSON.stringify({
                    success: true,
                    message: '优选IP已删除',
                    deleted: { ip: body.ip, port: port }
                }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            } else {
                return new Response(JSON.stringify({
                    success: false,
                    error: '不支持的请求方法',
                    message: '支持的方法: GET, POST, DELETE'
                }), {
                    status: 405,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        } catch (error) {
            return new Response(JSON.stringify({
                success: false,
                error: '处理请求失败',
                message: error.message
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    function updateConfigVariables() {
    // 【多选支持】wk 处理
    const manualRegionStr = getConfigValue('wk', '');
    if (manualRegionStr && manualRegionStr.trim()) {
        const regions = manualRegionStr.split(',')
            .map(r => r.trim().toUpperCase())
            .filter(Boolean);
        
        if (regions.length > 0) {
            manualWorkerRegion = regions[0];
            currentWorkerRegion = regions.join(',');
        }
    } else {
        const ci = getConfigValue('p', '');
        if (ci && ci.trim()) {
            currentWorkerRegion = 'CUSTOM';
        } else {
            manualWorkerRegion = '';
        }
    }

        const regionMatchingControl = getConfigValue('rm', '');
        if (regionMatchingControl && regionMatchingControl.toLowerCase() === 'no') {
            enableRegionMatching = false;
        } else {
            enableRegionMatching = true;
        }

        const vlessControl = getConfigValue('ev', '');
        if (vlessControl !== undefined && vlessControl !== '') {
            ev = vlessControl === 'yes' || vlessControl === true || vlessControl === 'true';
        }

        const tjControl = getConfigValue('et', '');
        if (tjControl !== undefined && tjControl !== '') {
            et = tjControl === 'yes' || tjControl === true || tjControl === 'true';
        }

        tp = getConfigValue('tp', '') || '';

        const xhttpControl = getConfigValue('ex', '');
        if (xhttpControl !== undefined && xhttpControl !== '') {
            ex = xhttpControl === 'yes' || xhttpControl === true || xhttpControl === 'true';
        }

        if (!ev && !et && !ex) {
            ev = true;
        }

        scu = getConfigValue('scu', '') || 'https://url.v1.mk/sub';

        const preferredDomainsControl = getConfigValue('epd', 'no');
        if (preferredDomainsControl !== undefined && preferredDomainsControl !== '') {
            epd = preferredDomainsControl !== 'no' && preferredDomainsControl !== false && preferredDomainsControl !== 'false';
        }

        const preferredIPsControl = getConfigValue('epi', '');
        if (preferredIPsControl !== undefined && preferredIPsControl !== '') {
            epi = preferredIPsControl !== 'no' && preferredIPsControl !== false && preferredIPsControl !== 'false';
        }

        const githubIPsControl = getConfigValue('egi', '');
        if (githubIPsControl !== undefined && githubIPsControl !== '') {
            egi = githubIPsControl !== 'no' && githubIPsControl !== false && githubIPsControl !== 'false';
        }

        const nativeAddressControl = getConfigValue('ena', '');
        if (nativeAddressControl !== undefined && nativeAddressControl !== '') {
            ena = nativeAddressControl !== 'no' && nativeAddressControl !== false && nativeAddressControl !== 'false';
        }

        const echControl = getConfigValue('ech', '');
        if (echControl !== undefined && echControl !== '') {
            enableECH = echControl === 'yes' || echControl === true || echControl === 'true';
        }

        // 更新自定义DNS和ECH域名
        const customDNSValue = getConfigValue('customDNS', '');
        if (customDNSValue && customDNSValue.trim()) {
            customDNS = customDNSValue.trim();
        } else {
            customDNS = 'https://223.5.5.5/dns-query';
        }

        const customECHDomainValue = getConfigValue('customECHDomain', '');
        if (customECHDomainValue && customECHDomainValue.trim()) {
            customECHDomain = customECHDomainValue.trim();
        } else {
            customECHDomain = 'cloudflare-ech.com';
        }

        // 如果启用了ECH，自动启用仅TLS模式（避免80端口干扰）
        // ECH需要TLS才能工作，所以必须禁用非TLS节点
        if (enableECH) {
            disableNonTLS = true;
        }

        // 检查dkby配置（如果手动设置了dkby=yes，也会启用仅TLS）
        const dkbyControl = getConfigValue('dkby', '');
        if (dkbyControl && dkbyControl.toLowerCase() === 'yes') {
            disableNonTLS = true;
        }

        cp = getConfigValue('d', '') || '';

        piu = getConfigValue('yxURL', '') || '';

        const envFallback = getConfigValue('p', '');
        if (envFallback) {
            fallbackAddress = envFallback.trim();
        } else {
            fallbackAddress = '';
        }

        socks5Config = getConfigValue('s', '') || '';
        if (socks5Config) {
            try {
                parsedSocks5Config = parseSocksConfig(socks5Config);
                isSocksEnabled = true;
            } catch (err) {
                isSocksEnabled = false;
            }
        } else {
            isSocksEnabled = false;
        }

        const yxbyControl = getConfigValue('yxby', '');
        if (yxbyControl && yxbyControl.toLowerCase() === 'yes') {
            disablePreferred = true;
        } else {
            disablePreferred = false;
        }
    }

    function updateCustomPreferredFromYx() {
        const yxValue = getConfigValue('yx', '');
        if (yxValue) {
            try {
                const preferredList = yxValue.split(',').map(item => item.trim()).filter(item => item);
                customPreferredIPs = [];
                customPreferredDomains = [];

                preferredList.forEach(item => {
                    let nodeName = '';
                    let addressPart = item;

                    if (item.includes('#')) {
                        const parts = item.split('#');
                        addressPart = parts[0].trim();
                        nodeName = parts[1].trim();
                    }

                    const { address, port } = parseAddressAndPort(addressPart);

                    if (!nodeName) {
                        nodeName = '自定义优选-' + address + (port ? ':' + port : '');
                    }

                    if (isValidIP(address)) {
                        customPreferredIPs.push({ 
                            ip: address, 
                            port: port,
                            isp: nodeName
                        });
                    } else {
                        customPreferredDomains.push({ 
                            domain: address, 
                            port: port,
                            name: nodeName
                        });
                    }
                });
            } catch (err) {
                customPreferredIPs = [];
                customPreferredDomains = [];
            }
        } else {
            customPreferredIPs = [];
            customPreferredDomains = [];
        }
    }

    function parseYxToArray(yxValue) {
        if (!yxValue || !yxValue.trim()) return [];

        const items = yxValue.split(',').map(item => item.trim()).filter(item => item);
        const result = [];

        for (const item of items) {
            let nodeName = '';
            let addressPart = item;

            if (item.includes('#')) {
                const parts = item.split('#');
                addressPart = parts[0].trim();
                nodeName = parts[1].trim();
            }

            const { address, port } = parseAddressAndPort(addressPart);

            if (!nodeName) {
                nodeName = address + (port ? ':' + port : '');
            }

            result.push({
                ip: address,
                port: port || 443,
                name: nodeName,
                addedAt: new Date().toISOString()
            });
        }

        return result;
    }

    function arrayToYx(array) {
        if (!array || array.length === 0) return '';

        return array.map(item => {
            const port = item.port || 443;
            return `${item.ip}:${port}#${item.name}`;
        }).join(',');
    }

    function isValidDomain(domain) {
        const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
        return domainRegex.test(domain);
    }

    async function parseTextToArray(content) {
        var processed = content.replace(/[	"'\r\n]+/g, ',').replace(/,+/g, ',');
        if (processed.charAt(0) == ',') processed = processed.slice(1);
        if (processed.charAt(processed.length - 1) == ',') processed = processed.slice(0, processed.length - 1);
        return processed.split(',');
    }

    async function fetchPreferredAPI(urls, defaultPort = '443', timeout = 3000) {
        if (!urls?.length) return [];
        const results = new Set();
        await Promise.allSettled(urls.map(async (url) => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);
                const response = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);
                let text = '';
                try {
                    const buffer = await response.arrayBuffer();
                    const contentType = (response.headers.get('content-type') || '').toLowerCase();
                    const charset = contentType.match(/charset=([^\s;]+)/i)?.[1]?.toLowerCase() || '';

                    let decoders = ['utf-8', 'gb2312'];
                    if (charset.includes('gb') || charset.includes('gbk') || charset.includes('gb2312')) {
                        decoders = ['gb2312', 'utf-8'];
                    }

                    let decodeSuccess = false;
                    for (const decoder of decoders) {
                        try {
                            const decoded = new TextDecoder(decoder).decode(buffer);
                            if (decoded && decoded.length > 0 && !decoded.includes('\ufffd')) {
                                text = decoded;
                                decodeSuccess = true;
                                break;
                            } else if (decoded && decoded.length > 0) {
                                continue;
                            }
                        } catch (e) {
                            continue;
                        }
                    }

                    if (!decodeSuccess) {
                        text = await response.text();
                    }

                    if (!text || text.trim().length === 0) {
                        return;
                    }
                } catch (e) {
                    return;
                }
                const lines = text.trim().split('\n').map(l => l.trim()).filter(l => l);
                const isCSV = lines.length > 1 && lines[0].includes(',');
                const IPV6_PATTERN = /^[^\[\]]*:[^\[\]]*:[^\[\]]/;
                if (!isCSV) {
                    lines.forEach(line => {
                        const hashIndex = line.indexOf('#');
                        const [hostPart, remark] = hashIndex > -1 ? [line.substring(0, hashIndex), line.substring(hashIndex)] : [line, ''];
                        let hasPort = false;
                        if (hostPart.startsWith('[')) {
                            hasPort = /\]:(\d+)$/.test(hostPart);
                        } else {
                            const colonIndex = hostPart.lastIndexOf(':');
                            hasPort = colonIndex > -1 && /^\d+$/.test(hostPart.substring(colonIndex + 1));
                        }
                        const port = new URL(url).searchParams.get('port') || defaultPort;
                        results.add(hasPort ? line : `${hostPart}:${port}${remark}`);
                    });
                } else {
                    const headers = lines[0].split(',').map(h => h.trim());
                    const dataLines = lines.slice(1);
                    if (headers.includes('IP地址') && headers.includes('端口') && headers.includes('数据中心')) {
                        const ipIdx = headers.indexOf('IP地址'), portIdx = headers.indexOf('端口');
                        const remarkIdx = headers.indexOf('国家') > -1 ? headers.indexOf('国家') :
                            headers.indexOf('城市') > -1 ? headers.indexOf('城市') : headers.indexOf('数据中心');
                        const tlsIdx = headers.indexOf('TLS');
                        dataLines.forEach(line => {
                            const cols = line.split(',').map(c => c.trim());
                            if (tlsIdx !== -1 && cols[tlsIdx]?.toLowerCase() !== 'true') return;
                            const wrappedIP = IPV6_PATTERN.test(cols[ipIdx]) ? `[${cols[ipIdx]}]` : cols[ipIdx];
                            results.add(`${wrappedIP}:${cols[portIdx]}#${cols[remarkIdx]}`);
                        });
                    } else if (headers.some(h => h.includes('IP')) && headers.some(h => h.includes('延迟')) && headers.some(h => h.includes('下载速度'))) {
                        const ipIdx = headers.findIndex(h => h.includes('IP'));
                        const delayIdx = headers.findIndex(h => h.includes('延迟'));
                        const speedIdx = headers.findIndex(h => h.includes('下载速度'));
                        const port = new URL(url).searchParams.get('port') || defaultPort;
                        dataLines.forEach(line => {
                            const cols = line.split(',').map(c => c.trim());
                            const wrappedIP = IPV6_PATTERN.test(cols[ipIdx]) ? `[${cols[ipIdx]}]` : cols[ipIdx];
                            results.add(`${wrappedIP}:${port}#CF优选 ${cols[delayIdx]}ms ${cols[speedIdx]}MB/s`);
                        });
                    }
                }
            } catch (e) { }
        }));
        return Array.from(results);
    }
