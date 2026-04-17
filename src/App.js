import { useState, useRef, useEffect } from "react";
import usdIcon  from './assets/USD.png';
import usdcIcon from './assets/USDC.png';
import usdtIcon from './assets/USDT.png';
import hkdIcon  from './assets/HKD.png';
import ibLogo      from './assets/Infiniteblock logo.png';
import hanpassLogo from './assets/hanpass.png';
import sentbeLogo  from './assets/Sentbe.png';
import moinLogo    from './assets/moin.png';

const ACCT_LOGO = { Hanpass: hanpassLogo, Sentbe: sentbeLogo, MOIN: moinLogo };

const G = {
  green:"#6FCF4A",greenLight:"#EBF8E1",greenDark:"#4CAF2A",
  white:"#FFFFFF",sidebar:"#F7FBF4",
  textDark:"#1A1A1A",textMid:"#555",textLight:"#999",
  border:"#E2EFD9",red:"#E53E3E",orange:"#F5A623",blue:"#2775CA",blueLight:"#EEF6FF",
};

const NETWORKS = { USD:[], HKD:[], USDC:["ERC-20","Base","SPL"], USDT:["ERC-20","TRC-20","SPL"] };
const NET_COLOR = {
  "ERC-20":    { bg:"#EDE9FE", text:"#7C3AED" },
  "Base":      { bg:"#DBEAFE", text:"#1D4ED8" },
  "TRC-20":    { bg:"#CCFBF1", text:"#0D9488" },
  "SPL":       { bg:"#FFF7ED", text:"#C2410C" },
  "SWIFT":     { bg:"#F0FDF4", text:"#166634" },
  "Local Bank":{ bg:"#EFF6FF", text:"#1D4ED8" },
  "HKD Local": { bg:"#FDF4FF", text:"#7E22CE" },
  "":          { bg:"#F3F4F6", text:"#6B7280" },
};

const ACCOUNTS = {
  Hanpass:{ id:"ID:17615-HNP", email:"admin@hanpass.com", kybStatus:"ACTIVE",   kybInfo:{name:"Hanpass Corp.",  registrationNo:"110-81-55000", country:"KR", address:"Seoul, Republic of Korea"}, balances:{ USD:{total:12450}, USDC:{"ERC-20":5200.50,"Base":3120.00,"SPL":1800.00}, USDT:{"ERC-20":2100.00,"TRC-20":3000.00,"SPL":950.00} } },
  Sentbe: { id:"ID:17616-STB", email:"admin@sentbe.com",  kybStatus:"INACTIVE", kybInfo:null,                                                                                                    balances:{ USD:{total:3200},  USDC:{"ERC-20":900.75,"Base":600.00,"SPL":420.00},   USDT:{"ERC-20":480.00,"TRC-20":500.00,"SPL":210.00} } },
  MOIN:   { id:"ID:17617-MON", email:"admin@moin.money",  kybStatus:"ACTIVE",   kybInfo:{name:"MOIN Corp.",     registrationNo:"110-81-77000", country:"KR", address:"Seoul, Republic of Korea"}, balances:{ USD:{total:7800},  USDC:{"ERC-20":2000.00,"Base":2200.00,"SPL":980.00}, USDT:{"ERC-20":1100.50,"TRC-20":1200.00,"SPL":630.00} } },
};
const MASTER_BAL = { USD:{total:52340}, USDC:{"ERC-20":18600,"Base":12600,"SPL":3200}, USDT:{"ERC-20":9400,"TRC-20":9500,"SPL":2100} };

// ── TX_DATA (확장 필드 포함) ──────────────────────────────────────────
const TX_DATA = [
  {
    id:"TX-041", date:"2026-03-29 14:32", type:"Payout", acct:"Hanpass",
    recipientName:"Kim Jae-won", recipientAccount:"Citibank **** 4821", recipientBank:"Citibank",
    amt:"-1,200", cur:"USD", network:"SWIFT", st:"Completed",
    txid:"0xABCD...1234",
    fromName:"Hanpass Corp.", fromAccount:"SGB Bank **** 9901", fromBank:"SGB Bank",
    fromAmt:"1,200", fromCur:"USD", fromNet:null,
    fxRate:null, fxFee:null,
    purpose:"TREASURY",
  },
  {
    id:"TX-040", date:"2026-03-28 09:15", type:"Convert", acct:"Sentbe",
    recipientName:"—", recipientAccount:null, recipientBank:null,
    amt:"+5,000", cur:"USDC", network:"ERC-20", st:"Completed",
    txid:"0xEF01...5678",
    fromName:null, fromAccount:null, fromBank:null,
    fromAmt:"5,001", fromCur:"USD", fromNet:"",
    fxRate:"1 USD = 0.9970 USDC", fxFee:"0.30% (총 15.00 USD)",
  },
  {
    id:"TX-039", date:"2026-03-27 17:50", type:"Payout", acct:"MOIN",
    recipientName:"0xF3a...c91B", recipientAccount:"0xF3a9...c91B", recipientBank:null,
    amt:"-800", cur:"USDC", network:"Base", st:"Pending",
    txid:"Pending...",
    fromName:"MOIN Corp.", fromAccount:"SGB Bank **** 7712", fromBank:"SGB Bank",
    fromAmt:"800", fromCur:"USDC", fromNet:null,
    fxRate:null, fxFee:null,
    purpose:"GOODS_SERVICES",
  },
  {
    id:"TX-038", date:"2026-03-26 11:20", type:"Deposit", acct:"Hanpass",
    recipientName:"Hanpass Corp.", recipientAccount:"SGB Bank **** 9901", recipientBank:"SGB Bank",
    amt:"+3,000", cur:"USD", network:"SWIFT", st:"Completed",
    txid:"SWIFT-REF-882211",
    fromName:"Hanpass Corp.", fromAccount:"하나은행 **** 3310", fromBank:"하나은행",
    fromAmt:"3,000", fromCur:"USD", fromNet:"",
    fxRate:null, fxFee:null,
    reference:"ID:17615-HNP",
  },
  {
    id:"TX-037", date:"2026-03-25 08:44", type:"Payout", acct:"Sentbe",
    recipientName:"Tokyo Trading Ltd", recipientAccount:"MUFG **** 3390", recipientBank:"MUFG",
    amt:"-2,500", cur:"USD", network:"SWIFT", st:"Failed",
    txid:"FAILED",
    fromName:"Sentbe Corp.", fromAccount:"SGB Bank **** 4455", fromBank:"SGB Bank",
    fromAmt:"2,500", fromCur:"USD", fromNet:null,
    fxRate:null, fxFee:null,
    purpose:"COMMISSION",
  },
  {
    id:"TX-036", date:"2026-03-24 13:05", type:"Payout", acct:"MOIN",
    recipientName:"0xA1b...d44A", recipientAccount:"0xA1b9...d44A", recipientBank:null,
    amt:"-400", cur:"USDT", network:"TRC-20", st:"Completed",
    txid:"0x1122...AABB",
    fromName:"MOIN Corp.", fromAccount:"SGB Bank **** 7712", fromBank:"SGB Bank",
    fromAmt:"400", fromCur:"USDT", fromNet:null,
    fxRate:null, fxFee:null,
    purpose:"TREASURY",
    txHash:"0x11223344556677889900AABBCCDDEEFF11223344556677889900AABBCCDDEEFF",
  },
  {
    id:"TX-035", date:"2026-03-23 10:30", type:"Convert", acct:"Hanpass",
    recipientName:"—", recipientAccount:null, recipientBank:null,
    amt:"+2,000", cur:"USDT", network:"TRC-20", st:"Completed",
    txid:"0xCCDD...9900",
    fromName:null, fromAccount:null, fromBank:null,
    fromAmt:"2,001", fromCur:"USD", fromNet:"",
    fxRate:"1 USD = 0.9970 USDT", fxFee:"0.30% (총 6.00 USD)",
  },
  {
    id:"TX-034", date:"2026-03-22 16:10", type:"Deposit", acct:"Sentbe",
    recipientName:"Sentbe Corp.", recipientAccount:"SGB Bank **** 4455", recipientBank:"SGB Bank",
    amt:"+1,800", cur:"USD", network:"Local Bank", st:"Completed",
    txid:"LOCAL-REF-334455",
    fromName:"Sentbe Corp.", fromAccount:"신한은행 **** 7788", fromBank:"신한은행",
    fromAmt:"1,800", fromCur:"USD", fromNet:"",
    fxRate:null, fxFee:null,
    reference:"ID:17616-STB",
  },
  {
    id:"TX-033", date:"2026-03-21 09:55", type:"Deposit", acct:"MOIN",
    recipientName:"MOIN Corp.", recipientAccount:"SGB Bank **** 7712", recipientBank:"SGB Bank",
    amt:"+2,500", cur:"USD", network:"SWIFT", st:"Completed",
    txid:"SWIFT-REF-556677",
    fromName:"MOIN Corp.", fromAccount:"국민은행 **** 5599", fromBank:"국민은행",
    fromAmt:"2,500", fromCur:"USD", fromNet:"",
    fxRate:null, fxFee:null,
    reference:"ID:17617-MON",
  },
  {
    id:"TX-032", date:"2026-03-20 14:20", type:"Convert", acct:"MOIN",
    recipientName:"—", recipientAccount:null, recipientBank:null,
    amt:"+1,500", cur:"USDC", network:"Base", st:"Completed",
    txid:"0x8899...CCEE",
    fromName:null, fromAccount:null, fromBank:null,
    fromAmt:"1,500", fromCur:"USDT", fromNet:"ERC-20",
    fxRate:"1 USDT = 0.9970 USDC", fxFee:"0.30% (총 4.50 USDT)",
  },
];

const MASTER_CV_DATA = [
  {
    id:"MCV-001", date:"2026-03-28 09:15", type:"Convert", acct:"Master",
    recipientName:"—", recipientAccount:null, recipientBank:null,
    amt:"+4,999", cur:"USDC", network:"ERC-20", st:"Completed",
    txid:"0xEF01...5678",
    fromName:null, fromAccount:null, fromBank:null,
    fromAmt:"5,000", fromCur:"USD", fromNet:"",
    fxRate:"1 USD = 0.9998 USDC", fxFee:"0.00% (총 0.00 USD)",
  },
  {
    id:"MCV-002", date:"2026-03-25 14:02", type:"Convert", acct:"Master",
    recipientName:"—", recipientAccount:null, recipientBank:null,
    amt:"+9,978", cur:"USD", network:"", st:"Completed",
    txid:"0xAA22...BB33",
    fromName:null, fromAccount:null, fromBank:null,
    fromAmt:"10,000", fromCur:"USDC", fromNet:"ERC-20",
    fxRate:"1 USDC = 0.9998 USD", fxFee:"0.20% (총 20.00 USDC)",
  },
  {
    id:"MCV-003", date:"2026-03-22 11:40", type:"Convert", acct:"Master",
    recipientName:"—", recipientAccount:null, recipientBank:null,
    amt:"+2,999", cur:"USDT", network:"TRC-20", st:"Completed",
    txid:"0xCC33...DD44",
    fromName:null, fromAccount:null, fromBank:null,
    fromAmt:"3,000", fromCur:"USD", fromNet:"",
    fxRate:"1 USD = 0.9998 USDT", fxFee:"0.00% (총 0.00 USD)",
  },
  {
    id:"MCV-004", date:"2026-03-20 16:25", type:"Convert", acct:"Master",
    recipientName:"—", recipientAccount:null, recipientBank:null,
    amt:"+1,996", cur:"USDC", network:"Base", st:"Pending",
    txid:"Pending...",
    fromName:null, fromAccount:null, fromBank:null,
    fromAmt:"2,000", fromCur:"USDT", fromNet:"ERC-20",
    fxRate:"1 USDT = 0.9998 USDC", fxFee:"0.20% (총 4.00 USDT)",
  },
];

const TR = [
  {id:"TR-012",date:"2026-03-29",from:"Hanpass",to:"Master", amt:"500",  cur:"USDC",network:"ERC-20",st:"Completed",note:"Fee settlement"},
  {id:"TR-011",date:"2026-03-28",from:"Master", to:"Sentbe", amt:"2,000",cur:"USD", network:"",      st:"Completed",note:"Liquidity top-up"},
  {id:"TR-010",date:"2026-03-27",from:"MOIN",   to:"Master", amt:"300",  cur:"USDT",network:"TRC-20",st:"Pending",  note:"Monthly settlement"},
  {id:"TR-009",date:"2026-03-25",from:"Master", to:"Hanpass",amt:"1,000",cur:"USD", network:"",      st:"Completed",note:"Operational fund"},
];

const INIT_CLIENTS = [
  {id:"SUB-001",name:"Hanpass",  email:"admin@hanpass.com",st:"Active",   created:"2026-01-10",mu:0.10,muOn:0.10,muOff:0.10,otpReq:false,locked:false, kybStatus:"ACTIVE"},
  {id:"SUB-002",name:"Sentbe",   email:"admin@sentbe.com", st:"Active",   created:"2026-02-03",mu:0.15,muOn:0.15,muOff:0.15,otpReq:true, locked:false, kybStatus:"INACTIVE"},
  {id:"SUB-003",name:"MOIN",     email:null,               st:"Active",   created:"2026-02-20",mu:0.10,muOn:0.10,muOff:0.10,otpReq:false,locked:false, kybStatus:"ACTIVE"},
  {id:"SUB-004",name:"WireKorea",email:"admin@wirek.com",  st:"Suspended",created:"2026-03-01",mu:0.20,muOn:0.20,muOff:0.20,otpReq:false,locked:false, kybStatus:"REJECTED",
    kybData:{enterpriseName:"와이어코리아 주식회사",enterpriseNameEn:"WireKorea Corp.",registrationNumber:"220-81-44321",enterpriseType:"주식회사",establishmentDate:"2021-06-15",officeCountry:"KR",officialAddress:"서울시 강남구 테헤란로 123",registrationAddress:"서울시 강남구 테헤란로 123",registrationCity:"Seoul",industry:"핀테크/송금",fundsSource:"영업 수익",accountPurpose:"해외 송금",tradingFrequency:"월 6~20회",transactionAmount:"$10,001 ~ $50,000",bearerShare:"N",email:"admin@wirek.com",ip:"203.0.113.55",deviceId:"DEV-WK9988"}},
  {id:"SUB-005",name:"PayTech",  email:"admin@paytech.com",st:"Active",   created:"2026-04-01",mu:0.12,muOn:0.12,muOff:0.12,otpReq:false,locked:false, kybStatus:"PROCESSING"},
];

const INIT_RECIP = [
  {id:1,name:"Kim Jae-won",       type:"Bank",  detail:"Citibank **** 4821",                                     cur:"USD",  network:"SWIFT",  counterpartyStatus:"ACTIVE",   registrationNo:"110-81-12345", country:"KR", address:"Seoul, Korea",    alias:"",          bankName:"Citibank",  swiftCode:"CITIKRSX"},
  {id:2,name:"Tokyo Trading Ltd", type:"Bank",  detail:"MUFG **** 3390",                                         cur:"USD",  network:"SWIFT",  counterpartyStatus:"PENDING",  registrationNo:"1234567890",   country:"JP", address:"Tokyo, Japan",    alias:"Tokyo Trade",bankName:"MUFG Bank", swiftCode:"BOTKJPJT"},
  {id:3,name:"USDC ERC-20 Wallet",type:"Crypto",detail:"0xA3f9b2c7d1e8f6a5B4C3D2E1F0a9b8c7d6e5f4A3c91B",        cur:"USDC", network:"ERC-20", counterpartyStatus:"ACTIVE",   registrationNo:"US123456",     country:"US", address:"New York, USA",   alias:"",          bankName:"",          swiftCode:""},
  {id:4,name:"USDT TRC-20 Wallet",type:"Crypto",detail:"TRXbc1qxy2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8pz09w",      cur:"USDT", network:"TRC-20", counterpartyStatus:"INACTIVE", registrationNo:"SG987654",     country:"SG", address:"Singapore",       alias:"",          bankName:"",          swiftCode:""},
  {id:5,name:"USDC Base Wallet",  type:"Crypto",detail:"0xB9d3e4f5a6b7c8d9E0F1A2B3C4D5E6F7A8B9C0D1E2F3f44A",    cur:"USDC", network:"Base",   counterpartyStatus:"PENDING",  registrationNo:"HK112233",     country:"HK", address:"Hong Kong",       alias:"",          bankName:"",          swiftCode:""},
];

const INIT_QUOTA = [
  {id:1,recipientId:1,recipientName:"Kim Jae-won",       registrationNo:"110-81-12345",docType:"Invoice",  requestedAmount:500000,totalApproved:500000,usedAmount:320000,frozenAmount:50000, status:"ACTIVE",  validFrom:"2025-01-01",validTo:"2025-12-31"},
  {id:2,recipientId:2,recipientName:"Tokyo Trading Ltd", registrationNo:"1234567890",  docType:"Contract", requestedAmount:200000,totalApproved:200000,usedAmount:180000,frozenAmount:10000, status:"PENDING", validFrom:"2025-03-01",validTo:"2025-09-30"},
  {id:3,recipientId:3,recipientName:"USDC ERC-20 Wallet",registrationNo:"US123456",    docType:"Invoice",  requestedAmount:100000,totalApproved:100000,usedAmount:10000, frozenAmount:5000,  status:"ACTIVE",  validFrom:"2025-01-01",validTo:"2025-12-31"},
  {id:4,recipientId:1,recipientName:"Kim Jae-won",       registrationNo:"110-81-12345",docType:"Contract", requestedAmount:300000,totalApproved:300000,usedAmount:150000,frozenAmount:0,     status:"INACTIVE",validFrom:"2024-01-01",validTo:"2024-12-31"},
];

// ── 입금 계좌 정보 ────────────────────────────────────────────────────
const MASTER_DEPOSIT = {
  fiat:[
    {accountName:"Infiniteblock Corp.",bankName:"SGB Bank",accountNo:"****-****-8801",swift:"SGBLHKHH",reference:"MASTER-IB",currency:"USD"},
    {accountName:"Infiniteblock Corp.",bankName:"Hang Seng Bank",accountNo:"****-****-8811",swift:"HASEHKHH",reference:"MASTER-IB",currency:"HKD"},
  ],
  crypto:{
    USDC:[
      {network:"ERC-20", address:"0x1A2B3C4D5E6F7890abcdef1234567890ABCDEF12"},
      {network:"Base",   address:"0xBASE1234abcdef5678ABCDEF9012345678901234"},
      {network:"SPL",    address:"MSTRspl1111AAAAAAbbbbbbCCCCCCddddddEEEEEE"},
    ],
    USDT:[
      {network:"ERC-20", address:"0xERC20usdt1234567890ABCDEF1234567890abcd"},
      {network:"TRC-20", address:"TRX1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZab"},
      {network:"SPL",    address:"MSTRspl2222FFFFFFggggggHHHHHHiiiiiJJJJJJ"},
    ],
  },
};

const SUB_DEPOSIT = {
  Hanpass:{
    fiat:[
      {accountName:"Hanpass Corp.",bankName:"SGB Bank",accountNo:"****-****-9901",swift:"SGBLHKHH",reference:"ID:17615-HNP",currency:"USD"},
      {accountName:"Hanpass Corp.",bankName:"Hang Seng Bank",accountNo:"****-****-9911",swift:"HASEHKHH",reference:"ID:17615-HNP",currency:"HKD"},
    ],
    crypto:{
      USDC:[
        {network:"ERC-20",address:"0xHNP_ERC20_usdc_1234567890abcdef12345678"},
        {network:"Base",  address:"0xHNP_BASE_usdc_abcdef1234567890ABCDEF12"},
        {network:"SPL",   address:"HNPspl1111AAAAbbbbCCCCddddEEEEffffGGGGhh"},
      ],
      USDT:[
        {network:"ERC-20",address:"0xHNP_ERC20_usdt_ABCDEF1234567890abcdef12"},
        {network:"TRC-20",address:"THNP_TRC20_usdt_1234567890ABCDEFGHIJKLab"},
        {network:"SPL",   address:"HNPspl2222IIIIjjjjKKKKllllMMMMnnnnOOOOpp"},
      ],
    },
  },
  Sentbe:{
    fiat:[
      {accountName:"Sentbe Corp.",bankName:"SGB Bank",accountNo:"****-****-4455",swift:"SGBLHKHH",reference:"ID:17616-STB",currency:"USD"},
      {accountName:"Sentbe Corp.",bankName:"Hang Seng Bank",accountNo:"****-****-4466",swift:"HASEHKHH",reference:"ID:17616-STB",currency:"HKD"},
    ],
    crypto:{
      USDC:[
        {network:"ERC-20",address:"0xSTB_ERC20_usdc_abcdef9876543210ABCDEF98"},
        {network:"Base",  address:"0xSTB_BASE_usdc_9876543210abcdefABCDEF98"},
        {network:"SPL",   address:"STBspl1111QQQQrrrrSSSSttttuuuuVVVVwwwwXX"},
      ],
      USDT:[
        {network:"ERC-20",address:"0xSTB_ERC20_usdt_9876543210ABCDEF98765432"},
        {network:"TRC-20",address:"TSTB_TRC20_usdt_9876543210ABCDEFGHIJKLcd"},
        {network:"SPL",   address:"STBspl2222YYYYzzzzAAAA1111BBBB2222CCCC33"},
      ],
    },
  },
  MOIN:{
    fiat:[
      {accountName:"MOIN Corp.",bankName:"SGB Bank",accountNo:"****-****-7712",swift:"SGBLHKHH",reference:"ID:17617-MON",currency:"USD"},
      {accountName:"MOIN Corp.",bankName:"Hang Seng Bank",accountNo:"****-****-7723",swift:"HASEHKHH",reference:"ID:17617-MON",currency:"HKD"},
    ],
    crypto:{
      USDC:[
        {network:"ERC-20",address:"0xMON_ERC20_usdc_1111222233334444AAAABBBB"},
        {network:"Base",  address:"0xMON_BASE_usdc_AAAABBBB1111222233334444"},
        {network:"SPL",   address:"MONspl1111DDDDeeeeFFFfggggHHHHiiii3333JJ"},
      ],
      USDT:[
        {network:"ERC-20",address:"0xMON_ERC20_usdt_CCCCDDDD5555666677778888"},
        {network:"TRC-20",address:"TMON_TRC20_usdt_5555666677778888CCCCDDef"},
        {network:"SPL",   address:"MONspl2222KKKKllllMMMMnnnn4444OOOO5555PP"},
      ],
    },
  },
};

const stColor = s => s==="Completed"||s==="Active"?"#4CAF2A":s==="Pending"||s==="Suspended"?"#F5A623":"#E53E3E";
function totalBal(b){ return b.total!==undefined ? b.total : Object.values(b).reduce((a,v)=>a+v,0); }

// ── UI ATOMS ──────────────────────────────────────────────────────
function CIcon({c,size=18}){
  const icons={USD:usdIcon,USDC:usdcIcon,USDT:usdtIcon};
  if(icons[c]) return(
    <img src={icons[c]} alt={c}
      style={{width:size,height:size,borderRadius:"50%",marginRight:4,flexShrink:0,objectFit:"cover"}}/>
  );
  const bg={USD:"#2775CA",USDC:"#2775CA",USDT:"#26A17B"}[c]||"#888";
  const l={USD:"$",USDC:"C",USDT:"T"}[c]||c[0];
  return <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:size,height:size,borderRadius:"50%",background:bg,color:"#fff",fontSize:size*0.5,fontWeight:700,marginRight:4,flexShrink:0}}>{l}</span>;
}
function NetBadge({net}){
  if(!net) return null;
  const {bg,text}=NET_COLOR[net]||NET_COLOR[""];
  return <span style={{background:bg,color:text,borderRadius:20,padding:"1px 7px",fontWeight:700,fontSize:9,marginLeft:3,whiteSpace:"nowrap"}}>{net}</span>;
}
function Lbl({t}){return <div style={{fontSize:10,fontWeight:700,color:G.textLight,marginBottom:4,textTransform:"uppercase",letterSpacing:0.4}}>{t}</div>;}
function Inp({v,set,ph,type="text"}){return <input type={type} value={v} onChange={e=>set(e.target.value)} placeholder={ph} style={{width:"100%",padding:"8px 11px",borderRadius:7,border:`1px solid ${G.border}`,fontSize:12,boxSizing:"border-box",marginBottom:10,outline:"none"}}/>;}
function Sel({v,set,opts}){return <select value={v} onChange={e=>set(e.target.value)} style={{width:"100%",padding:"8px 11px",borderRadius:7,border:`1px solid ${G.border}`,fontSize:12,marginBottom:10,background:G.white,boxSizing:"border-box"}}>{opts.map(o=><option key={o}>{o}</option>)}</select>;}
function Btn({t,onClick,color,sm}){return <button onClick={onClick} style={{background:color||G.green,color:"#fff",border:"none",borderRadius:sm?6:9,padding:sm?"6px 13px":"10px",width:sm?"auto":"100%",fontWeight:700,fontSize:sm?11:13,cursor:"pointer",flexShrink:0}}>{t}</button>;}
function Badge({t,color}){return <span style={{background:color+"22",color,borderRadius:20,padding:"2px 8px",fontWeight:700,fontSize:10}}>{t}</span>;}
function Card({children,style={}}){return <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:18,...style}}>{children}</div>;}

function CounterpartyStatusBadge({status}){
  const MAP={ACTIVE:{bg:"#EBF8E1",text:"#276749"},PENDING:{bg:"#FFFBEB",text:"#B45309"},INACTIVE:{bg:"#F3F4F6",text:"#6B7280"}};
  const s=MAP[status]||MAP.INACTIVE;
  return <span style={{background:s.bg,color:s.text,borderRadius:20,padding:"2px 8px",fontWeight:700,fontSize:10}}>{status||"INACTIVE"}</span>;
}
function KYBBadge({status}){
  const MAP={ACTIVE:{bg:"#EBF8E1",text:"#276749"},PROCESSING:{bg:"#FFFBEB",text:"#B45309"},INACTIVE:{bg:"#F3F4F6",text:"#6B7280"},REJECTED:{bg:"#FEE2E2",text:"#991B1B"}};
  const s=MAP[status]||MAP.INACTIVE;
  return <span style={{background:s.bg,color:s.text,borderRadius:20,padding:"2px 8px",fontWeight:700,fontSize:10}}>{status||"INACTIVE"}</span>;
}
function QuotaBar({total,used,frozen}){
  const avail=Math.max(0,total-used+frozen);
  const pct=total>0?Math.round(avail/total*100):0;
  const barColor=pct>=50?G.green:pct>=20?G.orange:G.red;
  return(
    <div style={{minWidth:80}}>
      <div style={{fontSize:11,fontWeight:700,color:G.textDark,marginBottom:3}}>${avail.toLocaleString()}</div>
      <div style={{height:5,background:"#F3F4F6",borderRadius:3,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:barColor,borderRadius:3}}/>
      </div>
      <div style={{fontSize:9,color:barColor,fontWeight:700,marginTop:1}}>{pct}% 잔여</div>
    </div>
  );
}

function NetSelector({cur,net,setNet}){
  const nets=NETWORKS[cur]||[];
  if(!nets.length) return null;
  return(<>
    <Lbl t="네트워크"/>
    <div style={{display:"flex",gap:7,marginBottom:10}}>
      {nets.map(n=>{const {bg,text}=NET_COLOR[n];return(
        <button key={n} onClick={()=>setNet(n)} style={{flex:1,padding:"7px",borderRadius:7,border:`1.5px solid ${net===n?text:G.border}`,background:net===n?bg:G.white,color:net===n?text:G.textMid,fontWeight:net===n?700:400,fontSize:12,cursor:"pointer"}}>{n}</button>
      );})}
    </div>
    {net&&<div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:7,padding:"8px 11px",fontSize:10,color:"#92400E",marginBottom:10}}>
      ⚠️ {cur} {net} 네트워크로 전송됩니다. 수신자 주소 네트워크를 반드시 확인하세요.
    </div>}
  </>);
}

function OtpInput({otp,setOtp,disabled}){
  const r0=useRef(),r1=useRef(),r2=useRef(),r3=useRef(),r4=useRef(),r5=useRef();
  const refs=[r0,r1,r2,r3,r4,r5];
  const handle=(i,v)=>{
    const d=v.replace(/\D/g,"").slice(-1);
    const next=[...otp];next[i]=d;setOtp(next);
    if(d&&i<5)refs[i+1].current?.focus();
  };
  const onKey=(i,e)=>{
    if(e.key==="Backspace"&&!otp[i]&&i>0)refs[i-1].current?.focus();
  };
  return(
    <div style={{display:"flex",gap:8,justifyContent:"center",margin:"20px 0"}}>
      {otp.map((d,i)=>(
        <input key={i} ref={refs[i]} type="text" inputMode="numeric" maxLength={1} value={d} disabled={disabled}
          onChange={e=>handle(i,e.target.value)} onKeyDown={e=>onKey(i,e)}
          style={{width:42,height:48,textAlign:"center",fontSize:22,fontWeight:700,borderRadius:8,
            border:`2px solid ${d?G.green:G.border}`,outline:"none",
            background:disabled?"#f5f5f5":G.white,color:G.textDark,
            transition:"border 0.15s",boxSizing:"border-box",cursor:disabled?"not-allowed":"text"}}/>
      ))}
    </div>
  );
}

function BalanceCards({balances}){
  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18}}>
      <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:11,padding:"14px 16px"}}>
        <div style={{display:"flex",alignItems:"center",marginBottom:8}}><CIcon c="USD"/><span style={{fontWeight:700,fontSize:12}}>USD</span></div>
        <div style={{fontSize:20,fontWeight:700}}>{balances.USD.total.toLocaleString("en-US",{minimumFractionDigits:2})}</div>
        <div style={{fontSize:10,color:G.textLight,marginTop:2}}>Avail. Balance</div>
      </div>
      {["USDC","USDT"].map(c=>(
        <div key={c} style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:11,padding:"14px 16px"}}>
          <div style={{display:"flex",alignItems:"center",marginBottom:8}}>
            <CIcon c={c}/><span style={{fontWeight:700,fontSize:12}}>{c}</span>
            <span style={{marginLeft:"auto",fontSize:11,fontWeight:700,color:G.textMid}}>{totalBal(balances[c]).toLocaleString("en-US",{minimumFractionDigits:2})}</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {Object.entries(balances[c]).map(([net,amt])=>{const {bg,text}=NET_COLOR[net];return(
              <div key={net} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:bg,borderRadius:6,padding:"4px 8px"}}>
                <span style={{fontSize:10,fontWeight:700,color:text}}>{net}</span>
                <span style={{fontSize:11,fontWeight:700,color:text}}>{amt.toLocaleString("en-US",{minimumFractionDigits:2})}</span>
              </div>
            );})}
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniBalCards({balances,title}){
  return(
    <Card>
      <div style={{fontSize:10,fontWeight:700,color:G.textLight,textTransform:"uppercase",marginBottom:10}}>{title}</div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${G.border}`}}>
          <div style={{display:"flex",alignItems:"center"}}><CIcon c="USD"/><span style={{fontWeight:600,fontSize:12}}>USD</span></div>
          <span style={{fontWeight:700,fontSize:12}}>{balances.USD.total.toLocaleString()}</span>
        </div>
        {["USDC","USDT"].map(c=>(
          <div key={c}>
            <div style={{display:"flex",alignItems:"center",marginBottom:4}}>
              <CIcon c={c}/><span style={{fontWeight:600,fontSize:12}}>{c}</span>
              <span style={{marginLeft:"auto",fontSize:11,color:G.textMid}}>{totalBal(balances[c]).toLocaleString()}</span>
            </div>
            {Object.entries(balances[c]).map(([net,amt])=>{const {bg,text}=NET_COLOR[net];return(
              <div key={net} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:bg,borderRadius:5,padding:"3px 8px",marginBottom:3}}>
                <span style={{fontSize:9,fontWeight:700,color:text}}>{net}</span>
                <span style={{fontSize:10,fontWeight:700,color:text}}>{amt.toLocaleString("en-US",{minimumFractionDigits:2})}</span>
              </div>
            );})}
          </div>
        ))}
      </div>
    </Card>
  );
}

// 타입별 뱃지
function TypeBadge({type}){
  if(type==="Convert") return <span style={{background:"#FFFBEB",color:"#B45309",borderRadius:20,padding:"2px 9px",fontWeight:700,fontSize:10,whiteSpace:"nowrap"}}>🔄 Convert</span>;
  if(type==="Deposit") return <span style={{background:"#EBF3FF",color:"#1D4ED8",borderRadius:20,padding:"2px 9px",fontWeight:700,fontSize:10,whiteSpace:"nowrap"}}>🏦 Deposit</span>;
  if(type==="Payout")  return <span style={{background:"#ECFDF5",color:"#065F46",borderRadius:20,padding:"2px 9px",fontWeight:700,fontSize:10,whiteSpace:"nowrap"}}>💸 Payout</span>;
  return <span style={{color:G.textMid,fontSize:11}}>{type}</span>;
}

// 금액+코인 표시
function AmtChip({amt,cur,net,color,size=13}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:3,whiteSpace:"nowrap"}}>
      <span style={{fontWeight:700,color:color||G.textDark,fontSize:size}}>{amt}</span>
      <CIcon c={cur} size={size+2}/>
      <span style={{fontWeight:600,color:G.textMid,fontSize:size-1}}>{cur}</span>
      {net&&<NetBadge net={net}/>}
    </div>
  );
}

// ── ORDER SIDE PANEL ────────────────────────────────────────────────
function PanelStBadge({st}){
  const MAP={
    "Completed":{bg:"#EBF8E1",text:"#276749"},
    "Processing":{bg:"#DBEAFE",text:"#1D4ED8"},
    "Pending":{bg:"#FFFBEB",text:"#B45309"},
    "Review":{bg:"#FEE2E2",text:"#991B1B"},
    "Frozen":{bg:"#FEE2E2",text:"#991B1B"},
    "Failed":{bg:"#F3F4F6",text:"#6B7280"},
    "Expired":{bg:"#F3F4F6",text:"#6B7280"},
  };
  const s=MAP[st]||{bg:"#F3F4F6",text:"#6B7280"};
  return <span style={{background:s.bg,color:s.text,borderRadius:20,padding:"2px 10px",fontWeight:700,fontSize:10,whiteSpace:"nowrap"}}>{st}</span>;
}

function CopyBtn({text,disabled=false}){
  const [copied,setCopied]=useState(false);
  const copy=()=>{
    if(disabled)return;
    navigator.clipboard.writeText(text||"").then(()=>{setCopied(true);setTimeout(()=>setCopied(false),1500);});
  };
  return(
    <button onClick={copy} disabled={disabled}
      style={{flexShrink:0,fontSize:9,padding:"2px 7px",borderRadius:4,
        border:`1px solid ${copied?"#4CAF2A":"#E2EFD9"}`,
        background:copied?"#EBF8E1":"#FFFFFF",
        color:copied?"#4CAF2A":disabled?"#ccc":"#999",
        cursor:disabled?"default":"pointer",fontWeight:600,whiteSpace:"nowrap"}}>
      {copied?"✓ 복사됨":"복사"}
    </button>
  );
}

function OrderSidePanel({tx,onClose,isMaster=false}){
  if(!tx) return null;
  const isConvert=tx.type==="Convert";
  const isPayout =tx.type==="Payout";
  const isDeposit=tx.type==="Deposit";
  const isCrypto=EXPLORER_URL[tx.network]!=null;
  const NET_GAS={"ERC-20":"~$2.50","Base":"~$0.10","TRC-20":"~$1.00","SPL":"~$0.05"};
  const rawAmt=parseFloat((tx.amt||"0").replace(/,/g,"").replace(/-/g,""))||0;
  const hashReady=tx.txHash&&tx.st!=="Pending"&&tx.st!=="Processing";

  return(
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.25)",zIndex:200}}/>
      <div style={{position:"fixed",top:0,right:0,bottom:0,width:360,background:"#FFFFFF",
        boxShadow:"-4px 0 24px rgba(0,0,0,0.12)",zIndex:201,display:"flex",flexDirection:"column",
        animation:"slideIn 0.22s ease"}}>
        <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

        {/* 헤더 */}
        <div style={{padding:"14px 18px",borderBottom:"1px solid #E2EFD9",display:"flex",alignItems:"center",
          justifyContent:"space-between",flexShrink:0,gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            <TypeBadge type={tx.type}/>
            {isMaster&&tx.acct&&(
              <span style={{fontSize:10,fontWeight:700,color:"#555",background:"#F7FBF4",borderRadius:10,padding:"2px 8px"}}>{tx.acct}</span>
            )}
            <PanelStBadge st={tx.st}/>
          </div>
          <button onClick={onClose} style={{background:"transparent",border:"none",fontSize:18,
            cursor:"pointer",color:"#999",lineHeight:1,flexShrink:0}}>✕</button>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:10}}>

          {/* ── CONVERT ── */}
          {isConvert&&(
            <>
              {/* FROM */}
              <div style={{background:"#FFF8F0",border:"1px solid #FDE8C8",borderRadius:10,padding:"14px 16px"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#92400E",textTransform:"uppercase",marginBottom:8}}>FROM</div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                  <CIcon c={tx.fromCur} size={16}/>
                  <span style={{fontWeight:700,fontSize:13,color:"#1A1A1A"}}>{tx.fromCur}</span>
                  {tx.fromNet&&<NetBadge net={tx.fromNet}/>}
                </div>
                <div style={{fontSize:18,fontWeight:700,color:"#E53E3E"}}>-{tx.fromAmt} {tx.fromCur}</div>
              </div>

              {/* 환율 */}
              <div style={{textAlign:"center",fontSize:11,color:"#555",fontWeight:600,padding:"2px 0"}}>
                ↓ &nbsp;{tx.fxRate||"—"}
              </div>

              {/* TO */}
              <div style={{background:"#EBF8E1",border:"1px solid #E2EFD9",borderRadius:10,padding:"14px 16px"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#4CAF2A",textTransform:"uppercase",marginBottom:8}}>TO</div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                  <CIcon c={tx.cur} size={16}/>
                  <span style={{fontWeight:700,fontSize:13,color:"#1A1A1A"}}>{tx.cur}</span>
                  {tx.network&&<NetBadge net={tx.network}/>}
                </div>
                <div style={{fontSize:18,fontWeight:700,color:"#4CAF2A"}}>{tx.amt} {tx.cur}</div>
              </div>

              {/* 수수료 */}
              {(()=>{
                const isOnRamp=["USD","HKD"].includes(tx.fromCur)&&["USDC","USDT"].includes(tx.cur);
                const feeLabel=isOnRamp?"On-ramp Fee":"Off-ramp Fee";
                let feeUsdStr="—";
                if(tx.fxFee&&tx.fxFee.includes("총")){const m=tx.fxFee.match(/총 ([\d.]+)/);if(m)feeUsdStr=`$${m[1]} USD`;}
                return(
                  <div style={{background:"#F7FBF4",border:"1px solid #E2EFD9",borderRadius:10,padding:"12px 16px"}}>
                    <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",marginBottom:8}}>수수료</div>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:11,color:"#555"}}>{feeLabel}</span>
                      <span style={{fontSize:12,fontWeight:700,color:"#F5A623"}}>{feeUsdStr}</span>
                    </div>
                  </div>
                );
              })()}
            </>
          )}

          {/* ── PAYOUT ── */}
          {isPayout&&(
            <>
              {/* RECIPIENT */}
              <div style={{background:"#F8F4FF",border:"1px solid #E9D8FD",borderRadius:10,padding:"14px 16px"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#6B21A8",textTransform:"uppercase",marginBottom:10}}>Recipient (수취인)</div>
                <div style={{fontWeight:700,fontSize:13,color:"#1A1A1A",marginBottom:6}}>{tx.recipientName}</div>
                <div style={{marginBottom:8}}>
                  {tx.recipientBank
                    ?<span style={{fontSize:10,background:"#DBEAFE",color:"#1D4ED8",borderRadius:10,padding:"2px 8px",fontWeight:700}}>Bank</span>
                    :<span style={{fontSize:10,background:"#F0FDF4",color:"#166534",borderRadius:10,padding:"2px 8px",fontWeight:700}}>Crypto</span>
                  }
                </div>
                {tx.recipientBank?(
                  <div style={{fontSize:11,color:"#555",marginBottom:8}}>{tx.recipientBank} | {tx.recipientAccount}</div>
                ):(
                  <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:8,flexWrap:"wrap"}}>
                    <span style={{fontSize:11,fontFamily:"monospace",color:"#1A1A1A",fontWeight:600}}>{shortAddr(tx.recipientAccount||"")}</span>
                    <CopyBtn text={tx.recipientAccount||""}/>
                    <NetBadge net={tx.network}/>
                  </div>
                )}
                <div style={{fontSize:15,fontWeight:700,color:"#E53E3E"}}>{tx.amt} {tx.cur}</div>
              </div>

              {/* FROM */}
              <div style={{background:"#F7FBF4",border:"1px solid #E2EFD9",borderRadius:10,padding:"14px 16px"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",marginBottom:8}}>From (송금인)</div>
                <div style={{fontWeight:700,fontSize:12,color:"#1A1A1A",marginBottom:4}}>{tx.fromName}</div>
                <div style={{fontSize:11,color:"#555",marginBottom:8}}>{tx.fromAccount}{tx.fromBank?` (${tx.fromBank})`:""}</div>
                <div style={{fontSize:13,fontWeight:700,color:"#1A1A1A"}}>{tx.fromAmt||tx.amt.replace("-","")} {tx.fromCur||tx.cur}</div>
              </div>

              {/* 송금 목적 */}
              {tx.purpose&&(
                <div style={{background:"#FFFFFF",border:"1px solid #E2EFD9",borderRadius:10,padding:"12px 16px"}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",marginBottom:6}}>송금 목적</div>
                  <span style={{fontSize:11,fontWeight:700,color:"#1A1A1A",background:"#F7FBF4",borderRadius:6,padding:"3px 8px"}}>{tx.purpose}</span>
                </div>
              )}

              {/* 수수료 */}
              {tx.st!=="Failed"&&(
                <div style={{background:"#EEF6FF",border:"1px solid #BEE3F8",borderRadius:10,padding:"12px 16px"}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#1D4ED8",textTransform:"uppercase",marginBottom:8}}>수수료</div>
                  {isCrypto?(
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:11,color:"#555"}}>네트워크 수수료</span>
                      <span style={{fontSize:12,fontWeight:700,color:"#F5A623"}}>{NET_GAS[tx.network]||"—"} USD <span style={{fontWeight:400,color:"#999",fontSize:10}}>(OSL 실시간)</span></span>
                    </div>
                  ):(
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:11,color:"#555"}}>Wire Fee</span>
                      <span style={{fontSize:12,fontWeight:700,color:"#F5A623"}}>{rawAmt>=100000?"면제 ($100K 이상)":"$35.00 USD"}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ── DEPOSIT ── */}
          {isDeposit&&(
            <>
              {/* TO */}
              <div style={{background:"#EEF6FF",border:"1px solid #BEE3F8",borderRadius:10,padding:"14px 16px"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#2775CA",textTransform:"uppercase",marginBottom:10}}>TO (입금 계좌)</div>
                <div style={{fontWeight:700,fontSize:13,color:"#1A1A1A",marginBottom:6}}>{tx.recipientName}</div>
                {tx.recipientBank?(
                  <div style={{fontSize:11,color:"#555",marginBottom:8}}>{tx.recipientBank} | {tx.recipientAccount}</div>
                ):(
                  <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:8,flexWrap:"wrap"}}>
                    <span style={{fontSize:11,fontFamily:"monospace",fontWeight:600}}>{shortAddr(tx.recipientAccount||"")}</span>
                    <CopyBtn text={tx.recipientAccount||""}/>
                    <NetBadge net={tx.network}/>
                  </div>
                )}
                <div style={{fontSize:15,fontWeight:700,color:"#4CAF2A"}}>{tx.amt} {tx.cur}</div>
              </div>

              {/* FROM */}
              <div style={{background:"#F7FBF4",border:"1px solid #E2EFD9",borderRadius:10,padding:"14px 16px"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",marginBottom:8}}>FROM (송금인)</div>
                <div style={{fontWeight:700,fontSize:12,color:"#1A1A1A",marginBottom:4}}>{tx.fromName}</div>
                {tx.fromBank?(
                  <div style={{fontSize:11,color:"#555",marginBottom:8}}>{tx.fromAccount} ({tx.fromBank})</div>
                ):(
                  <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:8,flexWrap:"wrap"}}>
                    <span style={{fontSize:11,fontFamily:"monospace"}}>{shortAddr(tx.fromAccount||"")}</span>
                    <CopyBtn text={tx.fromAccount||""}/>
                    <NetBadge net={tx.fromNet||tx.network}/>
                  </div>
                )}
                <div style={{fontSize:13,fontWeight:700,color:"#1A1A1A"}}>{tx.fromAmt} {tx.fromCur||tx.cur}</div>
              </div>
            </>
          )}

          {/* ── 공통: 거래 정보 ── */}
          <div style={{background:"#FFFFFF",border:"1px solid #E2EFD9",borderRadius:10,padding:"14px 16px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",marginBottom:10}}>거래 정보</div>

            {/* 상태 */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{fontSize:11,color:"#555"}}>상태</span>
              <PanelStBadge st={tx.st}/>
            </div>

            {/* TX ID */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{fontSize:11,color:"#555",flexShrink:0}}>TX ID</span>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <span style={{fontSize:11,fontWeight:600,color:"#1A1A1A",fontFamily:"monospace"}}>{tx.id}</span>
                <CopyBtn text={tx.id}/>
              </div>
            </div>

            {/* TX Hash (Crypto Payout/Deposit만) */}
            {isCrypto&&(isPayout||isDeposit)&&(
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:11,color:"#555",flexShrink:0}}>TX Hash</span>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{fontSize:10,fontFamily:"monospace",color:hashReady?"#1A1A1A":"#ccc",fontWeight:600}}>
                    {tx.txHash?shortAddr(tx.txHash):(tx.st==="Pending"||tx.st==="Processing")?"대기 중...":"—"}
                  </span>
                  <CopyBtn text={tx.txHash||""} disabled={!hashReady}/>
                  {EXPLORER_URL[tx.network]&&(
                    hashReady?(
                      <a href={EXPLORER_URL[tx.network]+tx.txHash} target="_blank" rel="noopener noreferrer"
                        style={{fontSize:13,textDecoration:"none"}}>🔗</a>
                    ):(
                      <span style={{fontSize:13,opacity:0.3}}>🔗</span>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Reference (Fiat Deposit만) */}
            {isDeposit&&!isCrypto&&tx.reference&&(
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:11,color:"#555"}}>Reference</span>
                <span style={{fontSize:11,fontWeight:600,color:"#1A1A1A",fontFamily:"monospace"}}>{tx.reference}</span>
              </div>
            )}

            {/* 거래 시간 */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:11,color:"#555"}}>거래 시간</span>
              <span style={{fontSize:11,color:"#1A1A1A",fontWeight:600}}>{tx.date}</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

// ── TX TABLE (타입별 행 레이아웃 + 클릭 → 사이드 패널) ──────────────
function TxTable({rows,showAcct,onSelect}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {rows.map(r=>{
        const isConvert=r.type==="Convert";
        const isDeposit=r.type==="Deposit";
        const isPayout =r.type==="Payout";
        return(
          <div key={r.id}
            onClick={()=>onSelect&&onSelect(r)}
            style={{
              background:G.white,border:`1px solid ${G.border}`,borderRadius:10,
              padding:"12px 16px",display:"grid",
              gridTemplateColumns:"auto 1fr auto",alignItems:"center",gap:12,
              cursor:"pointer",transition:"box-shadow 0.15s",
            }}
            onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 12px rgba(111,207,74,0.15)"}
            onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}
          >
            {/* 왼쪽: 타입 뱃지 */}
            <TypeBadge type={r.type}/>

            {/* 중앙: 타입별 정보 */}
            <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>

              {/* CONVERT: From → To */}
              {isConvert&&<>
                <div>
                  <div style={{fontSize:9,color:G.textLight,marginBottom:2}}>From</div>
                  <AmtChip amt={`-${r.fromAmt}`} cur={r.fromCur} net={r.fromNet||undefined} color={G.red}/>
                </div>
                <span style={{color:G.textLight,fontSize:18}}>→</span>
                <div>
                  <div style={{fontSize:9,color:G.textLight,marginBottom:2}}>To</div>
                  <AmtChip amt={r.amt} cur={r.cur} net={r.network||undefined} color={G.greenDark}/>
                </div>
              </>}

              {/* PAYOUT: 수취인 | 금액+통화+아이콘 | 네트워크 */}
              {isPayout&&<>
                <div>
                  <div style={{fontSize:9,color:G.textLight,marginBottom:2}}>수취인</div>
                  <div style={{fontWeight:600,fontSize:12,color:G.textDark}}>{r.recipientName}</div>
                </div>
                <div>
                  <div style={{fontSize:9,color:G.textLight,marginBottom:2}}>금액</div>
                  <AmtChip amt={r.amt} cur={r.cur} color={G.red}/>
                </div>
                <div>
                  <div style={{fontSize:9,color:G.textLight,marginBottom:2}}>네트워크</div>
                  <NetBadge net={r.network}/>
                </div>
              </>}

              {/* DEPOSIT: 수취인 | 금액 | 네트워크 */}
              {isDeposit&&<>
                <div>
                  <div style={{fontSize:9,color:G.textLight,marginBottom:2}}>수취인</div>
                  <div style={{fontWeight:600,fontSize:12,color:G.textDark}}>{r.recipientName}</div>
                </div>
                <div>
                  <div style={{fontSize:9,color:G.textLight,marginBottom:2}}>금액</div>
                  <AmtChip amt={r.amt} cur={r.cur} color={G.greenDark}/>
                </div>
                <div>
                  <div style={{fontSize:9,color:G.textLight,marginBottom:2}}>네트워크</div>
                  <NetBadge net={r.network}/>
                </div>
              </>}

            </div>

            {/* 오른쪽: 상태 + TXID + 날짜 + 어카운트 */}
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
              <Badge t={r.st} color={stColor(r.st)}/>
              {showAcct&&<span style={{fontSize:10,fontWeight:700,color:G.textMid}}>{r.acct}</span>}
              <span style={{fontSize:10,color:G.textLight}}>{r.id} · {r.date}</span>
            </div>

          </div>
        );
      })}
    </div>
  );
}

function TrTable({rows}){
  return(
    <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:10,overflow:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
        <thead><tr style={{background:G.sidebar}}>
          {["TR ID","Date","From","To","Amount","Currency","Network","Note","Status"].map(h=>(
            <th key={h} style={{padding:"9px 11px",textAlign:"left",fontWeight:700,color:G.textMid,borderBottom:`1px solid ${G.border}`}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>{rows.map((r,i)=>(
          <tr key={r.id} style={{background:i%2===0?G.white:"#FAFBF8"}}>
            <td style={{padding:"8px 11px",fontWeight:600}}>{r.id}</td>
            <td style={{padding:"8px 11px",color:G.textLight}}>{r.date}</td>
            <td style={{padding:"8px 11px",fontWeight:600,color:r.from==="Master"?G.greenDark:G.textDark}}>{r.from}</td>
            <td style={{padding:"8px 11px",fontWeight:600,color:r.to==="Master"?G.greenDark:G.textDark}}>{r.to}</td>
            <td style={{padding:"8px 11px",fontWeight:700}}>{r.amt}</td>
            <td style={{padding:"8px 11px",whiteSpace:"nowrap"}}><CIcon c={r.cur}/>{r.cur}</td>
            <td style={{padding:"8px 11px"}}><NetBadge net={r.network}/></td>
            <td style={{padding:"8px 11px",color:G.textLight,fontSize:10}}>{r.note}</td>
            <td style={{padding:"8px 11px"}}><Badge t={r.st} color={stColor(r.st)}/></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

// ── 복사 버튼 포함 주소 행 ────────────────────────────────────────────
function CopyRow({label,value,mono}){
  const [copied,setCopied]=useState(false);
  const copy=()=>{navigator.clipboard.writeText(value).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),1500);});};
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${G.border}`}}>
      <span style={{color:G.textLight,fontSize:11,flexShrink:0,minWidth:110}}>{label}</span>
      <div style={{display:"flex",alignItems:"center",gap:7,minWidth:0}}>
        <span style={{fontWeight:600,fontSize:11,color:G.textDark,wordBreak:"break-all",textAlign:"right",...(mono?{fontFamily:"monospace",fontSize:10}:{})}}>{value}</span>
        <button onClick={copy} style={{flexShrink:0,fontSize:9,padding:"2px 7px",borderRadius:4,border:`1px solid ${copied?G.green:G.border}`,background:copied?G.greenLight:G.white,color:copied?G.greenDark:G.textMid,cursor:"pointer",fontWeight:600,whiteSpace:"nowrap"}}>{copied?"✓ 복사됨":"복사"}</button>
      </div>
    </div>
  );
}

// ── 주소 단축 유틸 (앞6자...뒤6자) ──────────────────────────────────────
function shortAddr(addr){
  if(!addr) return "";
  return addr.length>14?`${addr.slice(0,6)}...${addr.slice(-6)}`:addr;
}

// ── 인라인 주소 표시 (단축 + 마우스오버 툴팁, 복사 없음) ──────────────
function AddressChip({address}){
  const [show,setShow]=useState(false);
  const hideRef=useRef(null);
  const enter=()=>{clearTimeout(hideRef.current);setShow(true);};
  const leave=()=>{hideRef.current=setTimeout(()=>setShow(false),150);};
  return(
    <span style={{position:"relative",display:"inline-block"}}
      onMouseEnter={enter} onMouseLeave={leave}>
      <span style={{fontFamily:"monospace",fontSize:11,color:G.textDark,cursor:"default",fontWeight:600}}>{shortAddr(address)}</span>
      {show&&(
        <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,background:"#1A1A1A",color:"#FFFFFF",fontSize:11,fontFamily:"monospace",padding:"6px 10px",borderRadius:6,zIndex:9999,whiteSpace:"nowrap",pointerEvents:"none"}}>
          {address}
        </div>
      )}
    </span>
  );
}

// ── 크립토 주소 행 (단축 표시 + 전체 주소 툴팁 + 복사) ──────────────────
function CryptoAddressRow({address}){
  const [copied,setCopied]=useState(false);
  const [show,setShow]=useState(false);
  const hideRef=useRef(null);
  const enter=()=>{clearTimeout(hideRef.current);setShow(true);};
  const leave=()=>{hideRef.current=setTimeout(()=>setShow(false),150);};
  const copy=()=>{navigator.clipboard.writeText(address).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),1500);});};
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${G.border}`}}>
      <span style={{color:G.textLight,fontSize:11,flexShrink:0,minWidth:70}}>입금 주소</span>
      <div style={{display:"flex",alignItems:"center",gap:7}}>
        <span style={{position:"relative",display:"inline-block"}} onMouseEnter={enter} onMouseLeave={leave}>
          <span style={{fontWeight:600,fontSize:11,color:G.textDark,fontFamily:"monospace",cursor:"default"}}>{shortAddr(address)}</span>
          {show&&(
            <div style={{position:"absolute",bottom:"calc(100% + 6px)",right:0,background:"#1A1A1A",color:"#FFFFFF",fontSize:11,fontFamily:"monospace",padding:"6px 10px",borderRadius:6,zIndex:9999,whiteSpace:"nowrap",pointerEvents:"none"}}>
              {address}
            </div>
          )}
        </span>
        <button onClick={copy} style={{flexShrink:0,fontSize:9,padding:"2px 7px",borderRadius:4,border:`1px solid ${copied?G.green:G.border}`,background:copied?G.greenLight:G.white,color:copied?G.greenDark:G.textMid,cursor:"pointer",fontWeight:600,whiteSpace:"nowrap"}}>
          {copied?"✓ 복사됨":"복사"}
        </button>
      </div>
    </div>
  );
}

// ── 익스플로러 링크 ────────────────────────────────────────────────────
const EXPLORER_URL={
  "ERC-20":"https://etherscan.io/tx/",
  "Base":"https://basescan.org/tx/",
  "TRC-20":"https://tronscan.org/#/transaction/",
  "SPL":"https://solscan.io/tx/",
};
function ExplorerLink({txid,network}){
  const [show,setShow]=useState(false);
  const hideRef=useRef(null);
  const enter=()=>{clearTimeout(hideRef.current);setShow(true);};
  const leave=()=>{hideRef.current=setTimeout(()=>setShow(false),150);};
  const base=EXPLORER_URL[network];
  const isFiatRef=!txid||txid==="Pending..."||txid==="FAILED"||txid.startsWith("SWIFT")||txid.startsWith("LOCAL");
  if(!base||isFiatRef)
    return <span style={{fontSize:10,color:G.textMid,fontFamily:"monospace",wordBreak:"break-all"}}>{txid||"—"}</span>;
  return(
    <span style={{position:"relative",display:"inline-flex",alignItems:"center",gap:4}} onMouseEnter={enter} onMouseLeave={leave}>
      <a href={base+txid} target="_blank" rel="noopener noreferrer"
        style={{color:"#1D4ED8",fontSize:10,fontWeight:600,textDecoration:"none",fontFamily:"monospace",cursor:"pointer"}}
        onMouseEnter={e=>e.currentTarget.style.textDecoration="underline"}
        onMouseLeave={e=>e.currentTarget.style.textDecoration="none"}>
        {shortAddr(txid)}
      </a>
      <span style={{flexShrink:0,fontSize:10}}>🔗</span>
      {show&&(
        <div style={{position:"absolute",bottom:"calc(100% + 6px)",left:0,background:"#1A1A1A",color:"#FFFFFF",fontSize:11,fontFamily:"monospace",padding:"6px 10px",borderRadius:6,zIndex:9999,whiteSpace:"nowrap",pointerEvents:"none"}}>
          {txid}
        </div>
      )}
    </span>
  );
}

// ── Deposit Instruction 공용 컴포넌트 ────────────────────────────────
function DepositInstruction({isMaster, acctName}){
  const [tab,setTab]=useState("Fiat");
  const [cryptoCur,setCryptoCur]=useState("USDC");
  const [fiatCur,setFiatCur]=useState("USD");

  const fiatData  = isMaster ? MASTER_DEPOSIT.fiat  : (SUB_DEPOSIT[acctName]?.fiat);
  const cryptoData= isMaster ? MASTER_DEPOSIT.crypto : (SUB_DEPOSIT[acctName]?.crypto);

  // Master 전용: Sub 탭
  const [subTab,setSubTab]=useState(isMaster?"Master":"");
  const subAccts=Object.keys(SUB_DEPOSIT);

  // Master 모드에서 보여줄 fiat/crypto 결정
  const activeFiatArr = isMaster&&subTab!=="Master" ? SUB_DEPOSIT[subTab]?.fiat   : fiatData;
  const activeFiat    = Array.isArray(activeFiatArr) ? activeFiatArr.find(f=>f.currency===fiatCur)||activeFiatArr[0] : activeFiatArr;
  const activeCrypto  = isMaster&&subTab!=="Master" ? SUB_DEPOSIT[subTab]?.crypto : cryptoData;

  const netColors={"ERC-20":NET_COLOR["ERC-20"],"Base":NET_COLOR["Base"],"TRC-20":NET_COLOR["TRC-20"],"SPL":NET_COLOR["SPL"]};

  return(
    <div style={{maxWidth:620}}>
      {/* Master 전용: Master/Sub 계좌 탭 */}
      {isMaster&&(
        <div style={{display:"flex",gap:5,marginBottom:16,flexWrap:"wrap"}}>
          {["Master",...subAccts].map(s=>(
            <button key={s} onClick={()=>setSubTab(s)}
              style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${subTab===s?"#1A1A1A":G.border}`,background:subTab===s?"#1A1A1A":G.white,color:subTab===s?"#fff":G.textMid,fontWeight:subTab===s?700:400,cursor:"pointer",fontSize:11}}>
              {s==="Master"?"🏦 Master (IB)":s}
            </button>
          ))}
        </div>
      )}

      {/* Fiat / Crypto 탭 */}
      <div style={{display:"flex",gap:5,marginBottom:14}}>
        {(isMaster&&subTab!=="Master"?["Crypto"]:["Fiat","Crypto"]).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{padding:"5px 14px",borderRadius:20,border:`1px solid ${tab===t?G.green:G.border}`,background:tab===t?G.greenLight:G.white,color:tab===t?G.greenDark:G.textMid,fontWeight:tab===t?700:400,cursor:"pointer",fontSize:11}}>
            {t==="Fiat"?"🏦 Fiat (Bank)":"🔗 Crypto"}
          </button>
        ))}
      </div>

      {/* ── Fiat 탭 ── */}
      {tab==="Fiat"&&(
        <div>
          {/* USD / HKD 통화 선택 */}
          <div style={{display:"flex",gap:7,marginBottom:14}}>
            {["USD","HKD"].map(c=>(
              <button key={c} onClick={()=>setFiatCur(c)}
                style={{display:"flex",alignItems:"center",gap:6,padding:"7px 16px",borderRadius:9,border:`2px solid ${fiatCur===c?G.green:G.border}`,background:fiatCur===c?G.greenLight:G.white,cursor:"pointer",fontWeight:fiatCur===c?700:400,color:fiatCur===c?G.greenDark:G.textMid,fontSize:12}}>
                {c==="USD"?<img src={usdIcon} alt="USD" style={{width:16,height:16,objectFit:"contain"}}/>:<img src={hkdIcon} alt="HKD" style={{width:16,height:16,objectFit:"contain"}}/>} {c}
              </button>
            ))}
          </div>
          {activeFiat&&(
            <Card>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                {activeFiat.currency==="USD"?<CIcon c="USD" size={20}/>:<img src={hkdIcon} alt="HKD" style={{width:20,height:20,objectFit:"contain"}}/>}
                <div>
                  <div style={{fontWeight:700,fontSize:13}}>{activeFiat.accountName}</div>
                  <div style={{fontSize:10,color:G.textLight}}>{activeFiat.bankName} {activeFiat.currency} 입금 계좌</div>
                </div>
              </div>
              <CopyRow label="Account Name" value={activeFiat.accountName}/>
              <CopyRow label="Bank Name"    value={activeFiat.bankName}/>
              <CopyRow label="Account No."  value={activeFiat.accountNo} mono/>
              <CopyRow label="SWIFT Code"   value={activeFiat.swift} mono/>
              <CopyRow label="Reference"    value={activeFiat.reference} mono/>
              <CopyRow label="Currency"     value={activeFiat.currency}/>
              <div style={{marginTop:12,background:G.greenLight,borderRadius:8,padding:"10px 13px",fontSize:11,color:G.greenDark}}>
                💡 송금 시 Reference 코드를 반드시 기재하세요. 미기재 시 입금 처리가 지연될 수 있습니다. 1–2 영업일 내 반영됩니다.
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ── Crypto 탭 ── */}
      {tab==="Crypto"&&activeCrypto&&(
        <div>
          {/* USDC / USDT 선택 */}
          <div style={{display:"flex",gap:7,marginBottom:14}}>
            {["USDC","USDT"].map(c=>(
              <button key={c} onClick={()=>setCryptoCur(c)}
                style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:9,border:`2px solid ${cryptoCur===c?G.green:G.border}`,background:cryptoCur===c?G.greenLight:G.white,cursor:"pointer",fontWeight:cryptoCur===c?700:400,color:cryptoCur===c?G.greenDark:G.textMid}}>
                <CIcon c={c} size={16}/><span style={{fontSize:12}}>{c}</span>
              </button>
            ))}
          </div>

          {/* 네트워크별 주소 카드 */}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {(activeCrypto[cryptoCur]||[]).map(({network,address})=>{
              const {bg,text}=netColors[network]||NET_COLOR[""];
              return(
                <Card key={network} style={{border:`1.5px solid ${bg}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                    <CIcon c={cryptoCur} size={20}/>
                    <div>
                      <div style={{fontWeight:700,fontSize:12}}>{cryptoCur}</div>
                      <span style={{background:bg,color:text,borderRadius:20,padding:"1px 8px",fontWeight:700,fontSize:10}}>{network}</span>
                    </div>
                  </div>
                  <CryptoAddressRow address={address}/>
                  <div style={{marginTop:10,background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:7,padding:"8px 11px",fontSize:10,color:"#92400E"}}>
                    ⚠️ <b>{network}</b> 네트워크로만 전송하세요. 다른 네트워크로 전송 시 자산이 손실될 수 있습니다.
                  </div>
                  {network==="SPL"&&(
                    <div style={{marginTop:6,background:"#FFF7ED",border:"1px solid #FDBA74",borderRadius:7,padding:"8px 11px",fontSize:10,color:"#C2410C"}}>
                      ⚠️ Solana(SPL) 네트워크 전용 주소입니다. SOL이 아닌 <b>USDC/USDT만</b> 전송 가능합니다.
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function exportCSV(rows,cols,fn){
  const h=cols.map(c=>c.l).join(",");
  const b=rows.map(r=>cols.map(c=>r[c.k]||"").join(",")).join("\n");
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([h+"\n"+b],{type:"text/csv"}));
  a.download=fn; a.click();
}

function FeeRow({c,isLast,isEditing,onEdit,onSave}){
  const [val,setVal]=useState((c.mu*100).toFixed(2));
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:isLast?"none":`1px solid ${G.border}`}}>
      <div>
        <div style={{fontWeight:700,fontSize:12}}>{c.name}</div>
        <div style={{fontSize:10,color:G.textLight,marginTop:1}}>최종: {(0.20+c.mu*100).toFixed(2)}%</div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        {isEditing?(
          <>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <input type="number" value={val} onChange={e=>setVal(e.target.value)} step="0.01"
                style={{width:64,padding:"5px 8px",borderRadius:6,border:`1.5px solid ${G.green}`,fontSize:12,outline:"none",textAlign:"right"}}/>
              <span style={{fontSize:11,color:G.textMid}}>%</span>
            </div>
            <Btn t="저장" sm color={G.green} onClick={()=>onSave(parseFloat(val)/100)}/>
            <Btn t="취소" sm color={G.textLight} onClick={onEdit}/>
          </>
        ):(
          <>
            <span style={{background:G.greenLight,color:G.greenDark,borderRadius:6,padding:"4px 12px",fontWeight:700,fontSize:12}}>+{(c.mu*100).toFixed(2)}%</span>
            <button onClick={onEdit} style={{fontSize:11,padding:"5px 10px",borderRadius:6,border:`1px solid ${G.border}`,background:G.white,cursor:"pointer",color:G.textMid,fontWeight:600}}>편집</button>
          </>
        )}
      </div>
    </div>
  );
}

function ConvertFeeRow({c,isLast,editState,onEdit,onSave}){
  const [valOn,setValOn]=useState((c.muOn*100).toFixed(2));
  const [valOff,setValOff]=useState((c.muOff*100).toFixed(2));
  const isEditOn=editState==='on';
  const isEditOff=editState==='off';
  return(
    <tr style={{borderBottom:isLast?"none":`1px solid ${G.border}`}}>
      <td style={{padding:"10px 14px",fontWeight:700,fontSize:12}}>{c.name}</td>
      <td style={{padding:"8px 14px",textAlign:"center"}}>
        {isEditOn?(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
            <input type="number" value={valOn} onChange={e=>setValOn(e.target.value)} step="0.01"
              style={{width:56,padding:"4px 6px",borderRadius:6,border:`1.5px solid ${G.green}`,fontSize:11,outline:"none",textAlign:"right"}}/>
            <span style={{fontSize:10,color:G.textMid}}>%</span>
            <Btn t="저장" sm color={G.green} onClick={()=>onSave('on',valOn)}/>
            <Btn t="취소" sm color={G.textLight} onClick={()=>onEdit(null)}/>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <span style={{background:G.greenLight,color:G.greenDark,borderRadius:6,padding:"3px 10px",fontWeight:700,fontSize:11}}>+{(c.muOn*100).toFixed(2)}%</span>
              <button onClick={()=>onEdit('on')} style={{fontSize:10,padding:"4px 8px",borderRadius:6,border:`1px solid ${G.border}`,background:G.white,cursor:"pointer",color:G.textMid,fontWeight:600}}>편집</button>
            </div>
            <span style={{fontSize:9,color:G.textLight}}>최종 {(c.muOn*100).toFixed(2)}%</span>
          </div>
        )}
      </td>
      <td style={{padding:"8px 14px",textAlign:"center"}}>
        {isEditOff?(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
            <input type="number" value={valOff} onChange={e=>setValOff(e.target.value)} step="0.01"
              style={{width:56,padding:"4px 6px",borderRadius:6,border:`1.5px solid ${G.green}`,fontSize:11,outline:"none",textAlign:"right"}}/>
            <span style={{fontSize:10,color:G.textMid}}>%</span>
            <Btn t="저장" sm color={G.green} onClick={()=>onSave('off',valOff)}/>
            <Btn t="취소" sm color={G.textLight} onClick={()=>onEdit(null)}/>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <span style={{background:G.greenLight,color:G.greenDark,borderRadius:6,padding:"3px 10px",fontWeight:700,fontSize:11}}>+{(c.muOff*100).toFixed(2)}%</span>
              <button onClick={()=>onEdit('off')} style={{fontSize:10,padding:"4px 8px",borderRadius:6,border:`1px solid ${G.border}`,background:G.white,cursor:"pointer",color:G.textMid,fontWeight:600}}>편집</button>
            </div>
            <span style={{fontSize:9,color:G.textLight}}>최종 {(0.20+c.muOff*100).toFixed(2)}%</span>
          </div>
        )}
      </td>
    </tr>
  );
}

function LoginPage({onLogin}){
  const [step,setStep]=useState(1);
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [showPw,setShowPw]=useState(false);
  const [otpArr,setOtpArr]=useState(["","","","","",""]);
  const [err,setErr]=useState("");
  const [failCount,setFailCount]=useState(0);
  const [showForgot,setShowForgot]=useState(false);

  const emailValid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(()=>{
    if(step===3&&otpArr.every(d=>d!==""))doOtpLogin();
  },[otpArr]); // eslint-disable-line

  const doOtpLogin=()=>{
    const a=Object.keys(ACCOUNTS).find(k=>ACCOUNTS[k].email===email)||"Hanpass";
    onLogin("sub",a,false);
  };

  const next=()=>{
    setErr("");
    if(step===1){
      if(!email){setErr("이메일을 입력하세요.");return;}
      if(!emailValid){setErr("올바른 이메일 형식을 입력하세요.");return;}
      setStep(2);
    } else if(step===2){
      if(!pw){setErr("비밀번호를 입력하세요.");return;}
      // 첫 로그인 임시 비밀번호
      if(pw==="Temp1234!"){onLogin("sub","Hanpass",true);return;}
      // 비밀번호 규칙 검증: 8자 이상, 대문자 1개 이상, 숫자 1개 이상
      const pwValid=pw.length>=8&&/[A-Z]/.test(pw)&&/[0-9]/.test(pw);
      if(!pwValid){
        const f=failCount+1;setFailCount(f);
        if(f>=5){setErr("계정이 잠겼습니다. 관리자에게 문의하세요.");return;}
        setErr("비밀번호는 8자 이상, 대문자 및 숫자를 포함해야 합니다.");
        return;
      }
      // 규칙을 만족하면 이메일로 계정 유형 판별
      const masterEmails=["master@inbl.io","admin@inbl.io","master@infiniteblock.io"];
      if(masterEmails.includes(email.toLowerCase())){
        onLogin("master","",false);return;
      }
      const matchedAcct=Object.keys(ACCOUNTS).find(k=>ACCOUNTS[k].email===email);
      if(matchedAcct){setStep(3);setOtpArr(["","","","","",""]);return;}
      // 이메일이 정확히 매칭되지 않아도 규칙 만족 시 Sub OTP로 진행
      setStep(3);setOtpArr(["","","",""," ",""]);
    }
  };

  return(
    <div style={{minHeight:"100vh",background:G.sidebar,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',sans-serif"}}>
      <div style={{width:380}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <img src={ibLogo} alt="InfiniteBlock" style={{width:46,height:46,borderRadius:11,objectFit:"contain",marginBottom:10}}/>
          <div style={{fontWeight:700,fontSize:18,color:G.textDark}}>
            {step===1?"Welcome to IB BizPay":"InfiniteBlock BizPay"}
          </div>
          <div style={{fontSize:12,color:G.textLight,marginTop:3}}>
            {step===1?"이메일 주소를 입력하세요":step===2?"비밀번호를 입력하세요":"2단계 인증"}
          </div>
        </div>
        <Card>
          <div style={{display:"flex",gap:5,marginBottom:20}}>
            {["이메일","비밀번호","OTP"].map((s,i)=>(
              <div key={i} style={{flex:1,textAlign:"center"}}>
                <div style={{height:3,borderRadius:2,background:step>i?G.green:G.border,marginBottom:5}}/>
                <div style={{fontSize:10,color:step===i+1?G.greenDark:G.textLight,fontWeight:step===i+1?700:400}}>{s}</div>
              </div>
            ))}
          </div>

          {step===1&&(
            <>
              <Lbl t="이메일"/>
              <Inp v={email} set={v=>{setEmail(v);setErr("");}} ph="your@company.com" type="email"/>
              {err&&<div style={{background:"#FFF5F5",border:"1px solid #FEB2B2",borderRadius:7,padding:"8px 11px",fontSize:11,color:G.red,marginBottom:10}}>{err}</div>}
              <button onClick={next} disabled={!email}
                style={{width:"100%",padding:"10px",borderRadius:9,border:"none",background:email?G.green:"#ccc",color:"#fff",fontWeight:700,fontSize:13,cursor:email?"pointer":"not-allowed",transition:"background 0.15s"}}>
                다음
              </button>
              <div style={{fontSize:10,color:G.textLight,marginTop:8,textAlign:"center"}}>예) admin@hanpass.com</div>
            </>
          )}

          {step===2&&(
            <>
              <button onClick={()=>{setStep(1);setErr("");setFailCount(0);setPw("");setShowPw(false);}}
                style={{background:"none",border:"none",color:G.textMid,cursor:"pointer",fontSize:11,marginBottom:12,padding:0,display:"flex",alignItems:"center",gap:4}}>
                ← 이메일 변경
              </button>
              <div style={{background:G.sidebar,border:`1px solid ${G.border}`,borderRadius:7,padding:"8px 11px",fontSize:12,color:G.textMid,marginBottom:12,fontWeight:600}}>
                {email}
              </div>
              <Lbl t="비밀번호"/>
              <div style={{position:"relative",marginBottom:10}}>
                <input type={showPw?"text":"password"} value={pw}
                  onChange={e=>{setPw(e.target.value);setErr("");}}
                  onKeyDown={e=>{if(e.key==="Enter")next();}}
                  placeholder="비밀번호 입력"
                  style={{width:"100%",padding:"8px 40px 8px 11px",borderRadius:7,border:`1px solid ${G.border}`,fontSize:12,boxSizing:"border-box",outline:"none"}}/>
                <button onClick={()=>setShowPw(v=>!v)}
                  style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:14,color:G.textLight,lineHeight:1}}>
                  {showPw?"🙈":"👁"}
                </button>
              </div>
              {err&&<div style={{background:"#FFF5F5",border:"1px solid #FEB2B2",borderRadius:7,padding:"8px 11px",fontSize:11,color:G.red,marginBottom:10}}>{err}</div>}
              <Btn t="로그인" onClick={next}/>
              <div style={{textAlign:"center",marginTop:10}}>
                <button onClick={()=>setShowForgot(true)}
                  style={{background:"none",border:"none",fontSize:11,color:"#1D4ED8",cursor:"pointer",textDecoration:"underline"}}>
                  비밀번호를 잊으셨나요?
                </button>
              </div>
            </>
          )}

          {step===3&&(
            <>
              <div style={{textAlign:"center",marginBottom:4}}>
                <div style={{fontWeight:700,fontSize:14,color:G.textDark,marginBottom:4}}>2단계 인증</div>
                <div style={{fontSize:12,color:G.textMid}}>Google Authenticator 6자리 코드 입력</div>
              </div>
              <OtpInput otp={otpArr} setOtp={setOtpArr} disabled={false}/>
              <div style={{background:G.blueLight,borderRadius:7,padding:"9px 12px",fontSize:11,color:G.blue,marginBottom:12}}>
                📱 Google Authenticator 앱에서 6자리 코드를 확인하세요.
              </div>
              {err&&<div style={{background:"#FFF5F5",border:"1px solid #FEB2B2",borderRadius:7,padding:"8px 11px",fontSize:11,color:G.red,marginBottom:10}}>{err}</div>}
              <Btn t="인증 완료" onClick={doOtpLogin}/>
              <div onClick={()=>{setStep(2);setErr("");setOtpArr(["","","","","",""]);}}
                style={{textAlign:"center",marginTop:10,fontSize:11,color:G.textLight,cursor:"pointer"}}>← 이전으로</div>
            </>
          )}
        </Card>
      </div>

      {/* 비밀번호 찾기 모달 */}
      {showForgot&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center"}}
          onClick={()=>setShowForgot(false)}>
          <div style={{background:G.white,borderRadius:16,padding:32,width:360,boxShadow:"0 8px 40px rgba(0,0,0,0.2)",textAlign:"center"}}
            onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:32,marginBottom:12}}>🔑</div>
            <div style={{fontWeight:700,fontSize:16,color:G.textDark,marginBottom:8}}>비밀번호 재설정 문의</div>
            <div style={{fontSize:13,color:G.textMid,lineHeight:1.7,marginBottom:20}}>
              비밀번호 재설정은 관리자를 통해 진행됩니다.<br/>
              아래 이메일로 문의해 주세요.
            </div>
            <div style={{background:G.greenLight,border:`1px solid ${G.border}`,borderRadius:10,padding:"12px 16px",marginBottom:20}}>
              <div style={{fontSize:11,color:G.textLight,marginBottom:4}}>관리자 이메일</div>
              <a href="mailto:contact@inbl.io"
                style={{fontSize:15,fontWeight:700,color:G.greenDark,textDecoration:"none"}}>
                contact@inbl.io
              </a>
            </div>
            <button onClick={()=>setShowForgot(false)}
              style={{width:"100%",padding:"10px",borderRadius:8,border:"none",background:G.green,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FirstLogin({acct,onDone}){
  const [step,setStep]=useState(1);
  const [tp,setTp]=useState("");
  const [np,setNp]=useState("");const [cp,setCp]=useState("");const [oc,setOc]=useState("");const [err,setErr]=useState("");
  const ok=np.length>=8&&/[A-Z]/.test(np)&&/[0-9]/.test(np);
  return(
    <div style={{minHeight:"100vh",background:G.sidebar,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',sans-serif"}}>
      <div style={{width:420}}>
        <div style={{textAlign:"center",marginBottom:22}}>
          <img src={ibLogo} alt="InfiniteBlock" style={{width:46,height:46,borderRadius:11,objectFit:"contain",marginBottom:10}}/>
          <div style={{fontWeight:700,fontSize:17}}>{step===1?"비밀번호 변경 필요":"OTP 등록"}</div>
          <div style={{fontSize:11,color:G.textLight,marginTop:3}}>{step===1?"임시 비밀번호로 로그인하셨습니다.":"계정 보안을 위해 OTP를 등록하세요."}</div>
        </div>
        <Card>
          {step===1&&<>
            <div style={{background:G.greenLight,borderRadius:8,padding:"9px 13px",fontSize:11,color:G.greenDark,marginBottom:14}}>✅ {ACCOUNTS[acct]?.email} 계정으로 초대되었습니다.</div>
            <Lbl t="현재 비밀번호 (임시)"/><Inp v={tp} set={setTp} ph="임시 비밀번호 입력" type="password"/>
            <Lbl t="새 비밀번호"/><Inp v={np} set={setNp} ph="8자 이상, 대문자+숫자 포함" type="password"/>
            <div style={{display:"flex",gap:6,marginBottom:12}}>{[["8자 이상",np.length>=8],["대문자",/[A-Z]/.test(np)],["숫자",/[0-9]/.test(np)]].map(([l,chk])=>(
              <div key={l} style={{fontSize:10,padding:"3px 8px",borderRadius:10,background:chk?G.greenLight:"#f5f5f5",color:chk?G.greenDark:G.textLight,fontWeight:chk?700:400}}>{chk?"✓ ":""}{l}</div>
            ))}</div>
            <Lbl t="비밀번호 확인"/><Inp v={cp} set={setCp} ph="동일하게 입력" type="password"/>
            {err&&<div style={{color:G.red,fontSize:11,marginBottom:8}}>{err}</div>}
            <Btn t="변경 및 계속 →" onClick={()=>{if(!tp){setErr("현재 비밀번호를 입력하세요.");return;}if(!ok){setErr("새 비밀번호 조건을 확인하세요.");return;}if(np!==cp){setErr("비밀번호 불일치");return;}setErr("");setStep(2);}}/>
          </>}
          {step===2&&<>
            <div style={{textAlign:"center",marginBottom:14}}>
              <div style={{display:"inline-block",background:"#fff",border:`1px solid ${G.border}`,borderRadius:9,padding:10,marginBottom:8}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,9px)",gap:1}}>{[1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,0,0,0,1,0,1,0,0,0,1,0,1,1,1,1,1,1,1,1,0,1,0,0,0,0,0,1,1,1,0,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,0,1,0,1,1,1,0,0,1,1,1,0,1,1].map((v,i)=>(
                  <div key={i} style={{width:9,height:9,background:v?"#1A1A1A":"transparent"}}/>
                ))}</div>
              </div>
              <div style={{fontSize:11,color:G.textMid}}>Google Authenticator로 QR 스캔</div>
            </div>
            <Lbl t="OTP 코드 입력"/>
            <input value={oc} onChange={e=>setOc(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="000000" style={{width:"100%",padding:"12px",borderRadius:8,border:`2px solid ${G.border}`,fontSize:20,letterSpacing:10,textAlign:"center",boxSizing:"border-box",marginBottom:10,fontWeight:700,outline:"none"}}/>
            {err&&<div style={{color:G.red,fontSize:11,marginBottom:8}}>{err}</div>}
            <Btn t="OTP 등록 완료 →" onClick={()=>{if(oc.length!==6){setErr("6자리를 입력하세요.");return;}onDone();}}/>
          </>}
        </Card>
      </div>
    </div>
  );
}

function SubDash({acctName,onLogout,onMaster}){
  const [menu,setMenu]=useState("Balance");
  const [acct,setAcct]=useState(acctName||"Hanpass");
  const [txF,setTxF]=useState("All");
  const [selectedTx,setSelectedTx]=useState(null);
  const [trFrom,setTrFrom]=useState(acctName||"Hanpass");
  const [trTo,setTrTo]=useState("Master");
  const [trCur,setTrCur]=useState("USDC");
  const [trNet,setTrNet]=useState("ERC-20");
  const [trAmt,setTrAmt]=useState("");
  const [trNote,setTrNote]=useState("");
  const [cvFrom,setCvFrom]=useState("USD");
  const [cvFromNet,setCvFromNet]=useState("");
  const [cvTo,setCvTo]=useState("USDC");
  const [cvToNet,setCvToNet]=useState("ERC-20");
  const [cvAmt,setCvAmt]=useState("");
  const [poType,setPoType]=useState("Fiat");
  const [poRec,setPoRec]=useState("");
  const [poAmt,setPoAmt]=useState("");
  const [poCur,setPoCur]=useState("USD");
  const [poNet,setPoNet]=useState("");
  const [poOrig,setPoOrig]=useState({name:"",registrationNo:"",country:"",address:""});
  const [poFeeLoading,setPoFeeLoading]=useState(false);
  const [poGasFee,setPoGasFee]=useState(null);
  const [poFeeError,setPoFeeError]=useState(false);
  const [recs,setRecs]=useState(INIT_RECIP);
  const [recTab,setRecTab]=useState(0);
  const [showAddRec,setShowAddRec]=useState(false);
  const [recStep,setRecStep]=useState(1);
  const [nr,setNr]=useState({name:"",type:"Bank",detail:"",cur:"USD",network:"",registrationNo:"",country:"",address:"",alias:"",bankName:"",swiftCode:""});
  const [nrQuota,setNrQuota]=useState({docType:"Invoice",amount:"",validFrom:"",validTo:"",file:null});
  const [editRecId,setEditRecId]=useState(null);
  const [er,setEr]=useState({name:"",type:"Bank",detail:"",cur:"USD",network:"",alias:""});
  const [quotas,setQuotas]=useState(INIT_QUOTA);
  const [quotaFormRecId,setQuotaFormRecId]=useState(null);
  const [quotaForm,setQuotaForm]=useState({docType:"Invoice",recipientId:"",amount:"",validFrom:"",validTo:"",file:null});
  const [expandedQuotaRecId,setExpandedQuotaRecId]=useState(null);
  const [deleteConfirmId,setDeleteConfirmId]=useState(null);
  const [showSec,setShowSec]=useState(false);
  const [curPw,setCurPw]=useState("");const [newPw,setNewPw]=useState("");const [confPw,setConfPw]=useState("");
  const [otpSent,setOtpSent]=useState(false);
  const [toast,setToast]=useState(null);
  const [showPoOtp,setShowPoOtp]=useState(false);
  const [poOtp,setPoOtp]=useState(["","","","","",""]);
  const [poOtpFail,setPoOtpFail]=useState(0);
  const [poCooldown,setPoCooldown]=useState(0);
  const [poSubmitting,setPoSubmitting]=useState(false);

  const T=m=>{setToast(m);setTimeout(()=>setToast(null),2500);};
  useEffect(()=>{
    if(poCooldown<=0)return;
    const id=setInterval(()=>setPoCooldown(s=>{if(s<=1){clearInterval(id);return 0;}return s-1;}),1000);
    return()=>clearInterval(id);
  },[poCooldown]);
  useEffect(()=>{
    if(poType!=="Crypto"||!poAmt||!poNet){setPoGasFee(null);setPoFeeLoading(false);setPoFeeError(false);return;}
    setPoFeeLoading(true);setPoGasFee(null);setPoFeeError(false);
    const GAS_FEE={"ERC-20":"3.50","Base":"0.05","TRC-20":"1.00","SPL":"0.50"};
    const t=setTimeout(()=>{setPoGasFee(GAS_FEE[poNet]||"0.05");setPoFeeLoading(false);},500);
    return()=>clearTimeout(t);
  },[poType,poAmt,poNet]);
  const account=ACCOUNTS[acct];
  const myTxAll=TX_DATA.filter(t=>t.acct===acct);
  const filtTx=txF==="All"?myTxAll:myTxAll.filter(t=>t.st===txF);
  const myTr=TR.filter(t=>t.from===acct||t.to===acct);
  const nav=[{g:"Transactions",items:["Balance","Orders","Transfers"]},{g:"Tools",items:["Deposit","Convert","Payout","Recipients"]}];
  const menuLabel={Balance:"Balance Overview",Orders:"Orders",Transfers:"Transfers",Deposit:"Deposit Instructions",Convert:"Convert",Payout:"Create Payout",Recipients:"Recipients"};

  const poRecObj=recs.find(r=>String(r.id)===String(poRec));
  const poRecName=poRecObj?.name||"—";
  const poNetDisplay=poType==="Fiat"?"SWIFT":(poNet||"—");
  const poOtpFilled=poOtp.every(d=>d!=="");
  const closePoOtp=()=>{setShowPoOtp(false);setPoOtp(["","","","","",""]);setPoOtpFail(0);setPoCooldown(0);setPoSubmitting(false);setPoGasFee(null);setPoFeeError(false);};
  const submitPoOtp=()=>{
    if(poSubmitting||poCooldown>0)return;
    setPoSubmitting(true);
    const code=poOtp.join("");
    setTimeout(()=>{
      if(code==="123456"){
        T(`✅ Payout ${Number(poAmt).toLocaleString()} ${poCur} 제출 완료`);
        setShowPoOtp(false);setPoAmt("");setPoRec("");setPoNet("");setPoOtp(["","","","","",""]);setPoOtpFail(0);setPoSubmitting(false);setPoGasFee(null);setPoFeeError(false);
      } else {
        const next=poOtpFail+1;
        setPoOtpFail(next);
        setPoOtp(["","","","","",""]);
        setPoSubmitting(false);
        if(next>=3){closePoOtp();T("🔒 잠시 후 다시 시도하세요. Payout 세션이 잠겼습니다.");}
        else{T(`⚠️ 코드가 올바르지 않습니다. (${3-next}회 남음)`);}
      }
    },600);
  };

  return(
    <div style={{display:"flex",height:"100vh",fontFamily:"'Inter',sans-serif",fontSize:12,background:G.white}}>
      <div style={{width:188,background:G.sidebar,borderRight:`1px solid ${G.border}`,display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"14px 13px 11px",borderBottom:`1px solid ${G.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <img src={ibLogo} alt="InfiniteBlock" style={{width:28,height:28,borderRadius:6,objectFit:"contain"}}/>
            <div><div style={{fontWeight:700,fontSize:11}}>InfiniteBlock</div><div style={{fontSize:9,color:G.textLight}}>BizPay</div></div>
          </div>
        </div>
        <div style={{padding:"9px 11px",borderBottom:`1px solid ${G.border}`}}>
          <div style={{fontSize:9,color:G.textLight,marginBottom:4,fontWeight:700,textTransform:"uppercase"}}>Sub Account</div>
          {Object.keys(ACCOUNTS).map(a=>(
            <div key={a} onClick={()=>setAcct(a)} style={{padding:"5px 8px",borderRadius:5,cursor:"pointer",marginBottom:2,background:acct===a?G.greenLight:"transparent",color:acct===a?G.greenDark:G.textMid,fontWeight:acct===a?700:400,fontSize:11,border:acct===a?`1px solid ${G.border}`:"1px solid transparent",display:"flex",alignItems:"center",gap:6}}>
              <img src={ACCT_LOGO[a]} alt={a} style={{width:18,height:18,borderRadius:4,objectFit:"contain"}}/>{a}
            </div>
          ))}
        </div>
        <div style={{flex:1,padding:"9px 11px",overflowY:"auto"}}>
          {nav.map(({g,items})=>(
            <div key={g} style={{marginBottom:10}}>
              <div style={{fontSize:9,color:G.textLight,fontWeight:700,textTransform:"uppercase",letterSpacing:0.6,marginBottom:3}}>{g}</div>
              {items.map(item=>(
                <div key={item} onClick={()=>{setMenu(item);setShowSec(false);setShowPoOtp(false);setPoOtp(["","","","","",""]);setPoOtpFail(0);setPoCooldown(0);setPoSubmitting(false);}} style={{padding:"6px 8px",borderRadius:5,cursor:"pointer",marginBottom:2,background:menu===item&&!showSec?G.greenLight:"transparent",color:menu===item&&!showSec?G.greenDark:G.textMid,fontWeight:menu===item&&!showSec?600:400,fontSize:11,borderLeft:menu===item&&!showSec?`3px solid ${G.green}`:"3px solid transparent"}}>{menuLabel[item]}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{padding:"9px 11px",borderTop:`1px solid ${G.border}`,display:"flex",flexDirection:"column",gap:5}}>
          <button onClick={()=>setShowSec(true)} style={{padding:"6px",background:G.greenLight,color:G.greenDark,border:`1px solid ${G.border}`,borderRadius:6,fontWeight:700,fontSize:10,cursor:"pointer"}}>⚙ 보안 설정</button>
          <button onClick={onMaster} style={{padding:"6px",background:"#1A1A1A",color:"#fff",border:"none",borderRadius:6,fontWeight:700,fontSize:10,cursor:"pointer"}}>🔐 Master View</button>
          <button onClick={onLogout} style={{padding:"6px",background:"transparent",color:G.red,border:`1px solid ${G.red}`,borderRadius:6,fontWeight:700,fontSize:10,cursor:"pointer"}}>로그아웃</button>
        </div>
      </div>

      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{height:46,borderBottom:`1px solid ${G.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",background:G.white,flexShrink:0}}>
          <div style={{fontWeight:700,fontSize:14}}>{showSec?"보안 설정":menuLabel[menu]}</div>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <div style={{background:G.greenLight,border:`1px solid ${G.border}`,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:600,color:G.greenDark}}>{acct}</div>
            <img src={ACCT_LOGO[acct]} alt={acct} style={{width:28,height:28,borderRadius:"50%",objectFit:"contain",border:`1px solid ${G.border}`}}/>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:20,background:"#FAFBF8"}}>

          {showSec&&(
            <div style={{maxWidth:460}}>
              <Card style={{marginBottom:14}}>
                <div style={{fontWeight:700,fontSize:13,marginBottom:3}}>비밀번호 변경</div>
                <div style={{fontSize:11,color:G.textLight,marginBottom:12}}>현재 비밀번호 확인 후 변경합니다.</div>
                <Lbl t="현재 비밀번호"/><Inp v={curPw} set={setCurPw} ph="현재 비밀번호" type="password"/>
                <Lbl t="새 비밀번호"/><Inp v={newPw} set={setNewPw} ph="8자 이상, 대문자+숫자" type="password"/>
                <Lbl t="비밀번호 확인"/><Inp v={confPw} set={setConfPw} ph="동일하게 입력" type="password"/>
                <Btn t="비밀번호 변경" onClick={()=>{if(!curPw||!newPw||newPw!==confPw){T("⚠️ 입력값 확인");return;}setCurPw("");setNewPw("");setConfPw("");T("✅ 비밀번호 변경 완료");}}/>
              </Card>
              <Card>
                <div style={{fontWeight:700,fontSize:13,marginBottom:3}}>OTP 재설정 요청</div>
                <div style={{fontSize:11,color:G.textLight,marginBottom:12}}>기기 분실 시 Master 관리자에게 재설정을 요청합니다.</div>
                {otpSent?(
                  <div style={{background:G.greenLight,borderRadius:8,padding:"12px",textAlign:"center"}}>
                    <div style={{fontWeight:700,color:G.greenDark,fontSize:12}}>✅ 요청 전송 완료</div>
                    <div style={{fontSize:11,color:G.textMid,marginTop:4}}>Master 승인 후 이메일로 QR코드가 발송됩니다.</div>
                  </div>
                ):(
                  <><div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:7,padding:"9px 12px",fontSize:11,color:"#92400E",marginBottom:10}}>⚠️ 승인 전까지 기존 OTP로 로그인하세요.</div>
                  <Btn t="OTP 재설정 요청" onClick={()=>{setOtpSent(true);T("📩 Master에게 요청 전송 완료");}}/></>
                )}
              </Card>
            </div>
          )}

          {!showSec&&menu==="Balance"&&(
            <div>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:14}}>
                <div style={{background:G.greenLight,border:`1px solid ${G.border}`,borderRadius:6,padding:"4px 10px",fontSize:11,color:G.greenDark,fontWeight:600}}>{account.id}</div>
                <div style={{fontSize:11,color:G.textLight}}>Available Balances</div>
              </div>
              <BalanceCards balances={account.balances}/>
              <div style={{fontWeight:700,fontSize:12,marginBottom:8}}>Recent Transactions</div>
              <TxTable rows={myTxAll.slice(0,4)} showAcct={false} onSelect={setSelectedTx}/>
            </div>
          )}

          {!showSec&&menu==="Orders"&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{display:"flex",gap:5}}>
                  {["All","Completed","Pending","Failed"].map(f=>(
                    <button key={f} onClick={()=>setTxF(f)} style={{padding:"4px 10px",borderRadius:20,border:`1px solid ${txF===f?G.green:G.border}`,background:txF===f?G.greenLight:G.white,color:txF===f?G.greenDark:G.textMid,fontWeight:txF===f?700:400,cursor:"pointer",fontSize:11}}>{f}</button>
                  ))}
                </div>
                <Btn t="📥 Export" sm onClick={()=>{
                  const rows=filtTx.map(r=>{
                    let feeUsd="";
                    if(r.fxFee&&r.fxFee.includes("총")){const m=r.fxFee.match(/총 ([\d.]+)/);if(m)feeUsd=m[1]+" USD";}
                    else if(r.type==="Payout"&&(r.network==="SWIFT"||r.network==="Local Bank"))feeUsd="35.00 USD";
                    return {...r,feeUsd};
                  });
                  exportCSV(rows,[{l:"TX ID",k:"id"},{l:"Date",k:"date"},{l:"Type",k:"type"},{l:"Recipient",k:"recipientName"},{l:"From Currency",k:"fromCur"},{l:"From Amount",k:"fromAmt"},{l:"To Currency",k:"cur"},{l:"To Amount",k:"amt"},{l:"Network",k:"network"},{l:"Fee (USD)",k:"feeUsd"},{l:"Status",k:"st"}],`orders_${acct}.csv`);
                }}/>
              </div>
              <TxTable rows={filtTx} showAcct={false} onSelect={setSelectedTx}/>
            </div>
          )}

          {!showSec&&menu==="Transfers"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                <Card>
                  <div style={{fontWeight:700,fontSize:13,marginBottom:14}}>내부 이체</div>
                  <Lbl t="방향"/>
                  <div style={{display:"flex",gap:7,marginBottom:10}}>
                    {[`${acct} → Master`,`Master → ${acct}`].map(d=>{
                      const active=(d.startsWith(acct)&&trFrom===acct)||(d.startsWith("Master")&&trFrom==="Master");
                      return(
                        <button key={d} onClick={()=>{const s2m=d.startsWith(acct);setTrFrom(s2m?acct:"Master");setTrTo(s2m?"Master":acct);}}
                          style={{flex:1,padding:"8px 4px",borderRadius:7,border:`1.5px solid ${active?G.green:G.border}`,background:active?G.greenLight:G.white,fontWeight:active?700:400,cursor:"pointer",color:active?G.greenDark:G.textMid,fontSize:10,textAlign:"center"}}>
                          {d}
                        </button>
                      );
                    })}
                  </div>
                  <Lbl t="통화"/>
                  <div style={{display:"flex",gap:7,marginBottom:10}}>
                    {["USD","USDC","USDT"].map(c=>(
                      <button key={c} onClick={()=>{setTrCur(c);setTrNet(NETWORKS[c]?.[0]||"");}}
                        style={{flex:1,padding:"7px",borderRadius:7,border:`1.5px solid ${trCur===c?G.green:G.border}`,background:trCur===c?G.greenLight:G.white,cursor:"pointer",fontWeight:trCur===c?700:400,color:trCur===c?G.greenDark:G.textMid,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                        <CIcon c={c} size={14}/>{c}
                      </button>
                    ))}
                  </div>
                  <NetSelector cur={trCur} net={trNet} setNet={setTrNet}/>
                  <Lbl t="금액"/><Inp v={trAmt} set={setTrAmt} ph="숫자 입력"/>
                  <Lbl t="Note (선택)"/><Inp v={trNote} set={setTrNote} ph="e.g. Fee settlement"/>
                  <div style={{fontSize:10,color:"#2B6CB0",background:"#EBF4FF",borderRadius:6,padding:"6px 10px",marginBottom:10}}>ℹ️ Internal Transfer는 수수료 없음. OSL 동일 계정 내 이체.</div>
                  <Btn t="이체 실행" onClick={()=>{if(!trAmt){T("⚠️ 금액 입력");return;}T(`✅ ${trAmt} ${trCur}${trNet?" ("+trNet+")":""}: ${trFrom}→${trTo}`);setTrAmt("");setTrNote("");}}/>
                </Card>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <Card>
                    <div style={{fontSize:10,fontWeight:700,color:G.textLight,textTransform:"uppercase",marginBottom:8}}>Summary</div>
                    {[["Sent to Master","$1,250 USDC"],["Received","$3,000 USD"],["Pending","1 transfer"]].map(([k,v])=>(
                      <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${G.border}`}}>
                        <span style={{color:G.textMid,fontSize:11}}>{k}</span><span style={{fontWeight:700,fontSize:11}}>{v}</span>
                      </div>
                    ))}
                  </Card>
                  <div style={{background:G.greenLight,border:`1px solid ${G.border}`,borderRadius:10,padding:12,fontSize:11,color:G.greenDark}}>💡 Sub ↔ Master transfers settle instantly.</div>
                </div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{fontWeight:700,fontSize:12}}>Transfer History</div>
                <Btn t="📥 Export" sm onClick={()=>exportCSV(myTr,[{l:"TR ID",k:"id"},{l:"Date",k:"date"},{l:"From",k:"from"},{l:"To",k:"to"},{l:"Amount",k:"amt"},{l:"Currency",k:"cur"},{l:"Network",k:"network"},{l:"Note",k:"note"},{l:"Status",k:"st"}],`transfers_${acct}.csv`)}/>
              </div>
              <TrTable rows={myTr}/>
            </div>
          )}

          {!showSec&&menu==="Deposit"&&(
            <DepositInstruction isMaster={false} acctName={acct}/>
          )}

          {!showSec&&menu==="Convert"&&(
            <div style={{maxWidth:440}}>
              <Card>
                <div style={{fontWeight:700,fontSize:13,marginBottom:14}}>Convert</div>
                {/* FROM */}
                <Lbl t="FROM — 통화"/>
                <Sel v={cvFrom} set={v=>{setCvFrom(v);setCvFromNet(NETWORKS[v]?.[0]||"");setCvTo((v==="USD"||v==="HKD")?"USDC":"USD");setCvToNet(NETWORKS[(v==="USD"||v==="HKD")?"USDC":"USD"]?.[0]||"");setCvAmt("");}} opts={["USD","HKD","USDC","USDT"]}/>
                {NETWORKS[cvFrom]?.length>0&&(
                  <div style={{display:"flex",gap:7,marginBottom:10}}>
                    {NETWORKS[cvFrom].map(n=>{const {bg,text}=NET_COLOR[n];return(
                      <button key={n} onClick={()=>setCvFromNet(n)} style={{flex:1,padding:"7px",borderRadius:7,border:`1.5px solid ${cvFromNet===n?text:G.border}`,background:cvFromNet===n?bg:G.white,color:cvFromNet===n?text:G.textMid,fontWeight:cvFromNet===n?700:400,fontSize:12,cursor:"pointer"}}>{n}</button>
                    );})}
                  </div>
                )}
                {/* ↕ 방향 전환 */}
                <div style={{textAlign:"center",margin:"2px 0 6px"}}>
                  <button onClick={()=>{
                    const [f,fn,t,tn]=[cvFrom,cvFromNet,cvTo,cvToNet];
                    setCvFrom(t);setCvFromNet(tn);setCvTo(f);setCvToNet(fn);setCvAmt("");
                  }} style={{background:G.greenLight,border:`1px solid ${G.border}`,borderRadius:20,padding:"4px 14px",cursor:"pointer",fontSize:15,color:G.greenDark,fontWeight:700}}>↕</button>
                </div>
                {/* TO */}
                <Lbl t="TO — 통화"/>
                <Sel v={cvTo} set={v=>{setCvTo(v);setCvToNet(NETWORKS[v]?.[0]||"");setCvAmt("");}} opts={["USD","HKD","USDC","USDT"].filter(c=>c!==cvFrom)}/>
                {NETWORKS[cvTo]?.length>0&&(
                  <div style={{display:"flex",gap:7,marginBottom:10}}>
                    {NETWORKS[cvTo].map(n=>{const {bg,text}=NET_COLOR[n];return(
                      <button key={n} onClick={()=>setCvToNet(n)} style={{flex:1,padding:"7px",borderRadius:7,border:`1.5px solid ${cvToNet===n?text:G.border}`,background:cvToNet===n?bg:G.white,color:cvToNet===n?text:G.textMid,fontWeight:cvToNet===n?700:400,fontSize:12,cursor:"pointer"}}>{n}</button>
                    );})}
                  </div>
                )}
                <Lbl t="금액"/><Inp v={cvAmt} set={setCvAmt} ph="숫자 입력"/>
                {/* 수수료 미리보기 */}
                {cvAmt&&(()=>{
                  const clientData=INIT_CLIENTS.find(c=>c.name===acct)||INIT_CLIENTS[0];
                  const isOnRamp=["USD","HKD"].includes(cvFrom)&&["USDC","USDT"].includes(cvTo);
                  const oslBase=isOnRamp?0:0.002;
                  const mu=isOnRamp?(clientData.muOn||0):(clientData.muOff||0);
                  const feeRate=oslBase+mu;
                  const feePct=(feeRate*100).toFixed(2);
                  const amtNum=parseFloat(cvAmt||0);
                  const totalFee=(amtNum*feeRate).toFixed(2);
                  const received=(amtNum*(1-feeRate)*0.9970).toFixed(2);
                  return(
                  <div style={{background:G.greenLight,border:`1px solid ${G.border}`,borderRadius:10,padding:"12px 16px",marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontSize:11,color:G.textMid}}>환율 미리보기</span>
                      <span style={{fontSize:11,fontWeight:600}}>1 {cvFrom} = 0.9970 {cvTo}</span>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",paddingBottom:8,borderBottom:`1px solid ${G.border}`,marginBottom:8}}>
                      <span style={{fontSize:11,color:G.textMid}}>수수료</span>
                      <span style={{fontSize:11,fontWeight:700,color:G.orange}}>{feePct}% (총 {totalFee} {cvFrom})</span>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:12,fontWeight:700}}>예상 수령액</span>
                      <div style={{display:"flex",alignItems:"center",gap:4}}>
                        <span style={{fontSize:16,fontWeight:700,color:G.greenDark}}>{received}</span>
                        <CIcon c={cvTo} size={16}/><span style={{fontSize:12,fontWeight:600,color:G.greenDark}}>{cvTo}</span>
                        {cvToNet&&<NetBadge net={cvToNet}/>}
                      </div>
                    </div>
                  </div>
                  );
                })()}
                <Btn t="환전 실행" onClick={()=>{if(!cvAmt){T("⚠️ 금액 입력");return;}T(`✅ ${cvAmt} ${cvFrom}${cvFromNet?" ("+cvFromNet+")":""}→${cvTo}${cvToNet?" ("+cvToNet+")":""} 완료!`);setCvAmt("");}}/>
              </Card>
            </div>
          )}

          {!showSec&&menu==="Payout"&&(()=>{
            const poAmtNum=parseFloat((poAmt||"0").replace(/,/g,""))||0;
            const swiftFee=35;
            const isLargeAmt=poAmtNum>=100000;
            const kybActive=account?.kybStatus==="ACTIVE";
            const origOk=kybActive||(poOrig.name&&poOrig.registrationNo&&poOrig.country&&poOrig.address);
            const filteredRecs=recs.filter(r=>poType==="Fiat"?r.type==="Bank":r.type==="Crypto");
            const nextDisabled=!poRec||!poAmt||!origOk||(poType==="Crypto"&&!poNet);
            const stepDone=[!!poRec,!!origOk,!!poAmt];
            return(
            <div style={{maxWidth:480}}>
              <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
              <Card>
                {/* 헤더 + 스텝 상태 */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                  <div style={{fontWeight:700,fontSize:13}}>Create Payout</div>
                  <div style={{display:"flex",gap:4}}>
                    {["수취인","송금인","금액"].map((s,i)=>(
                      <span key={i} style={{fontSize:9,padding:"2px 8px",borderRadius:10,background:stepDone[i]?G.green:G.border,color:stepDone[i]?"#fff":G.textMid,fontWeight:700,transition:"background 0.2s"}}>
                        Step {i+1}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 송금 유형 토글 */}
                <div style={{display:"flex",gap:7,marginBottom:18}}>
                  {["Fiat","Crypto"].map(tp=>(
                    <button key={tp} onClick={()=>{setPoType(tp);setPoCur(tp==="Fiat"?"USD":"USDC");setPoNet("");setPoRec("");setPoAmt("");setPoGasFee(null);setPoFeeError(false);}}
                      style={{flex:1,padding:"9px",borderRadius:8,border:`2px solid ${poType===tp?G.green:G.border}`,background:poType===tp?G.greenLight:G.white,fontWeight:700,cursor:"pointer",color:poType===tp?G.greenDark:G.textMid,fontSize:12}}>
                      {tp==="Fiat"?"🏦 Fiat (Bank)":"🔗 Crypto"}
                    </button>
                  ))}
                </div>

                {/* ── Step 1: 수취인 (Beneficiary) ── */}
                <div style={{borderTop:`1px solid ${G.border}`,paddingTop:14,marginBottom:14}}>
                  <div style={{fontSize:10,fontWeight:700,color:G.green,marginBottom:12,textTransform:"uppercase",letterSpacing:0.5}}>Step 1 — 수취인 (Beneficiary)</div>
                  {filteredRecs.length===0?(
                    <div style={{background:"#FFF7ED",border:"1px solid #FED7AA",borderRadius:8,padding:"12px 14px",fontSize:11,color:"#92400E"}}>
                      등록된 수취인이 없습니다.
                      <button onClick={()=>setMenu("Recipients")} style={{marginLeft:8,fontSize:11,color:G.green,background:"none",border:"none",cursor:"pointer",fontWeight:700,textDecoration:"underline"}}>
                        수취인 등록 바로가기 →
                      </button>
                    </div>
                  ):(
                    <>
                      <Lbl t="수취인 선택"/>
                      <select value={poRec} onChange={e=>{setPoRec(e.target.value);}}
                        style={{width:"100%",padding:"8px 11px",borderRadius:7,border:`1px solid ${G.border}`,fontSize:12,marginBottom:10,background:G.white,boxSizing:"border-box"}}>
                        <option value="">— 수취인 선택 —</option>
                        {filteredRecs.map(r=>(
                          <option key={r.id} value={r.id}>{r.name} · {r.cur}{r.network?" ("+r.network+")":""}</option>
                        ))}
                      </select>
                      {/* 수취인 미리보기 */}
                      {poRecObj&&(
                        <div style={{background:"#F8FAFF",border:`1px solid ${G.border}`,borderRadius:8,padding:"12px 14px",marginBottom:4}}>
                          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:7,flexWrap:"wrap"}}>
                            <span style={{fontWeight:700,fontSize:12}}>{poRecObj.name}</span>
                            <CounterpartyStatusBadge status={poRecObj.counterpartyStatus}/>
                          </div>
                          {poRecObj.type==="Bank"?(
                            <div style={{fontSize:11,color:G.textMid,lineHeight:1.7}}>
                              <div>🏦 {poRecObj.bankName||"—"} · {poRecObj.detail}</div>
                              <div>SWIFT: {poRecObj.swiftCode||"—"}</div>
                            </div>
                          ):(
                            <div style={{fontSize:11,color:G.textMid,lineHeight:1.7}}>
                              <div>🔗 <AddressChip address={poRecObj.detail}/></div>
                              <div>Network: {poRecObj.network}</div>
                            </div>
                          )}
                          {poRecObj.counterpartyStatus!=="ACTIVE"&&(
                            <div style={{fontSize:10,color:G.orange,marginTop:7,padding:"5px 9px",background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:5}}>
                              ⚠️ Counterparty 상태가 ACTIVE가 아닙니다. Payout 실행 시 거부될 수 있습니다.
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* ── Step 2: 송금인 (Originator) ── */}
                <div style={{borderTop:`1px solid ${G.border}`,paddingTop:14,marginBottom:14}}>
                  <div style={{fontSize:10,fontWeight:700,color:G.green,marginBottom:12,textTransform:"uppercase",letterSpacing:0.5}}>Step 2 — 송금인 (Originator)</div>
                  {kybActive?(
                    <div style={{background:G.greenLight,border:`1px solid ${G.border}`,borderRadius:8,padding:"12px 14px",fontSize:11}}>
                      <div style={{fontWeight:700,marginBottom:8,color:G.greenDark}}>✅ KYB 완료 — 자동 입력 (읽기 전용)</div>
                      {[["법인명",account?.kybInfo?.name],["등록번호",account?.kybInfo?.registrationNo],["국가",account?.kybInfo?.country],["주소",account?.kybInfo?.address]].map(([k,v])=>(
                        <div key={k} style={{display:"flex",gap:8,marginBottom:3}}>
                          <span style={{color:G.textMid,minWidth:48}}>{k}</span>
                          <span style={{fontWeight:600,color:G.textDark}}>{v}</span>
                        </div>
                      ))}
                    </div>
                  ):(
                    <>
                      <div style={{background:"#FFF7ED",border:"1px solid #FED7AA",borderRadius:7,padding:"8px 11px",fontSize:10,color:"#92400E",marginBottom:12}}>
                        ⚠️ KYB 미완료 계정입니다. 매 Payout마다 송금인 정보를 직접 입력해야 합니다. KYB 완료 후에는 자동 입력됩니다.
                      </div>
                      <Lbl t="법인명 (Legal Name)*"/>
                      <Inp v={poOrig.name} set={v=>setPoOrig(o=>({...o,name:v}))} ph="송금인 법인명"/>
                      <Lbl t="사업자등록번호 (Registration No.)*"/>
                      <Inp v={poOrig.registrationNo} set={v=>setPoOrig(o=>({...o,registrationNo:v}))} ph="예: 110-81-12345"/>
                      <Lbl t="국가 (Country Code)*"/>
                      <Inp v={poOrig.country} set={v=>setPoOrig(o=>({...o,country:v}))} ph="ISO alpha-2 (예: KR)"/>
                      <Lbl t="주소 (Address)*"/>
                      <Inp v={poOrig.address} set={v=>setPoOrig(o=>({...o,address:v}))} ph="법인 주소"/>
                    </>
                  )}
                </div>

                {/* ── Step 3: 금액 및 통화 ── */}
                <div style={{borderTop:`1px solid ${G.border}`,paddingTop:14,marginBottom:14}}>
                  <div style={{fontSize:10,fontWeight:700,color:G.green,marginBottom:12,textTransform:"uppercase",letterSpacing:0.5}}>Step 3 — 금액 및 통화</div>
                  <Lbl t="통화"/><Sel v={poCur} set={v=>{setPoCur(v);setPoNet("");setPoGasFee(null);}} opts={poType==="Fiat"?["USD","HKD"]:["USDC","USDT"]}/>
                  {poType==="Crypto"&&<NetSelector cur={poCur} net={poNet} setNet={v=>{setPoNet(v);setPoGasFee(null);}}/>}
                  <Lbl t="금액"/>
                  <Inp v={poAmt} set={v=>{setPoAmt(v);setPoGasFee(null);}} ph={poType==="Fiat"?"숫자 입력 (소수점 2자리)":"숫자 입력 (소수점 6자리)"}/>
                  {/* Fiat 수수료 블록 */}
                  {poType==="Fiat"&&poAmt&&(
                    <div style={{background:G.blueLight,border:"1px solid #BEE3F8",borderRadius:10,padding:"14px 16px",marginBottom:12}}>
                      <div style={{fontSize:12,fontWeight:700,color:"#2B6CB0",marginBottom:10}}>수수료 미리보기</div>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                        <span style={{fontSize:11,color:G.textMid}}>Wire Fee</span>
                        <span style={{fontSize:11,fontWeight:700,color:G.orange}}>
                          {isLargeAmt?"면제 ($100K 이상)":"$35 / 건 (예치 잔액 차감)"}
                        </span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:"1px solid #BEE3F8"}}>
                        <span style={{fontSize:12,fontWeight:700}}>수취인 수령 예상액</span>
                        <span style={{fontSize:13,fontWeight:700,color:G.greenDark}}>{poAmtNum.toLocaleString("en-US",{minimumFractionDigits:2})} {poCur}</span>
                      </div>
                      <div style={{fontSize:10,color:"#2B6CB0",marginTop:6}}>⏱ 환율 고정: Confirm 시점에 10분간 고정됩니다.</div>
                    </div>
                  )}
                  {/* Crypto 수수료 블록 */}
                  {poType==="Crypto"&&poAmt&&poNet&&(()=>{
                    const NET_GAS_USD={"ERC-20":"~$2.50","Base":"~$0.10","TRC-20":"~$1.00","SPL":"~$0.05"};
                    const gasUsd=NET_GAS_USD[poNet]||"—";
                    return(
                    <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:10,padding:"14px 16px",marginBottom:12}}>
                      <div style={{fontSize:12,fontWeight:700,color:"#92400E",marginBottom:10}}>수수료 미리보기</div>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                        <span style={{fontSize:11,color:G.textMid}}>네트워크 수수료</span>
                        <span style={{fontSize:11,fontWeight:700,color:G.orange}}>{gasUsd} USD <span style={{fontWeight:400,color:G.textLight}}>(OSL 실시간 고시)</span></span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:"1px solid #FDE68A"}}>
                        <span style={{fontSize:12,fontWeight:700}}>수취인 수령 예상액</span>
                        <span style={{fontSize:13,fontWeight:700,color:G.greenDark}}>{poAmtNum.toLocaleString("en-US",{minimumFractionDigits:2})} {poCur}</span>
                      </div>
                      <div style={{fontSize:10,color:"#92400E",marginTop:6}}>※ 네트워크 수수료는 예치 잔액(USD)에서 차감됩니다.</div>
                    </div>
                    );
                  })()}
                </div>

                {/* Payout 실행 버튼 */}
                <button disabled={nextDisabled}
                  onClick={()=>{
                    if(!poRec||!poAmt){T("⚠️ 수취인/금액을 입력하세요");return;}
                    if(!origOk){T("⚠️ 송금인 정보를 입력하세요");return;}
                    if(poType==="Crypto"&&!poNet){T("⚠️ 네트워크를 선택하세요");return;}
                    setShowPoOtp(true);setPoOtp(["","","","","",""]);setPoOtpFail(0);setPoCooldown(0);setPoSubmitting(false);
                  }}
                  style={{width:"100%",padding:"12px",borderRadius:9,border:"none",fontWeight:700,fontSize:13,
                    background:nextDisabled?"#ccc":G.green,color:nextDisabled?G.textLight:"#fff",
                    cursor:nextDisabled?"not-allowed":"pointer",transition:"background 0.15s"}}>
                  🚀 Payout 실행
                </button>
              </Card>
            </div>
            );
          })()}

          {/* OTP 모달 오버레이 — Sub */}
          {showPoOtp&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{background:G.white,borderRadius:16,padding:28,width:400,boxShadow:"0 8px 40px rgba(0,0,0,0.22)",position:"relative"}}>
                <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>🔐 Payout 보안 인증</div>
                <div style={{fontSize:11,color:G.textMid,marginBottom:16}}>이 송금을 실행하려면 OTP 코드를 입력하세요.</div>
                {/* 송금 요약 */}
                <div style={{background:"#F8FAFF",border:`1px solid ${G.border}`,borderRadius:10,padding:"14px 16px",marginBottom:14}}>
                  {(()=>{
                    const amtN=parseFloat((poAmt||"0").replace(/,/g,""))||0;
                    const NET_GAS_USD_OTP={"ERC-20":"~$2.50","Base":"~$0.10","TRC-20":"~$1.00","SPL":"~$0.05"};
                    const fee=poType==="Fiat"?(amtN>=100000?"Wire Fee: 면제 ($100K 이상)":"Wire Fee: $35 / 건"):`네트워크 수수료: ${NET_GAS_USD_OTP[poNet]||"—"} USD (OSL 실시간 고시)`;
                    return [["수취인",poRecName],[`금액`,`${amtN.toLocaleString("en-US",{minimumFractionDigits:2})} ${poCur}`],["수수료",fee],["수취인 수령",`${amtN.toLocaleString("en-US",{minimumFractionDigits:2})} ${poCur}`],["네트워크",poNetDisplay]];
                  })().map(([k,v],i,arr)=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:i<arr.length-1?`1px solid ${G.border}`:"none"}}>
                      <span style={{color:G.textMid,fontSize:12}}>{k}</span>
                      <span style={{fontWeight:k==="총 차감액"?800:700,fontSize:k==="총 차감액"?13:12,color:k==="수수료"?G.orange:k==="총 차감액"?G.textDark:undefined}}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:10,color:G.orange,background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:7,padding:"8px 12px",marginBottom:16}}>
                  ※ 위 정보를 반드시 확인하세요. 제출 후 취소는 불가합니다.
                </div>
                <div style={{height:"1px",background:G.border,marginBottom:16}}/>
                <div style={{textAlign:"center",fontSize:12,color:G.textMid,fontWeight:600,marginBottom:4}}>Google Authenticator 앱의</div>
                <div style={{textAlign:"center",fontSize:11,color:G.textLight,marginBottom:12}}>6자리 코드를 입력하세요.</div>
                <OtpInput otp={poOtp} setOtp={setPoOtp} disabled={poCooldown>0||poSubmitting}/>
                {poOtpFail>0&&poOtpFail<3&&(
                  <div style={{textAlign:"center",fontSize:11,color:G.red,marginBottom:10}}>코드가 올바르지 않습니다. ({3-poOtpFail}회 남음)</div>
                )}
                {poCooldown>0&&(
                  <div style={{textAlign:"center",fontSize:11,color:G.red,fontWeight:700,marginBottom:10}}>🔒 잠시 후 다시 시도하세요 ({poCooldown}초)</div>
                )}
                <div style={{display:"flex",gap:8,marginBottom:4}}>
                  <button onClick={closePoOtp}
                    style={{flex:1,padding:"11px",borderRadius:8,border:`1px solid ${G.border}`,background:G.white,color:G.textMid,cursor:"pointer",fontWeight:600,fontSize:12}}>
                    취소
                  </button>
                  <button
                    disabled={!poOtpFilled||poCooldown>0||poSubmitting}
                    onClick={submitPoOtp}
                    style={{flex:2,padding:"11px",borderRadius:8,border:"none",fontWeight:700,fontSize:13,
                      cursor:(!poOtpFilled||poCooldown>0||poSubmitting)?"not-allowed":"pointer",
                      background:(!poOtpFilled||poCooldown>0||poSubmitting)?"#ccc":G.green,
                      color:(!poOtpFilled||poCooldown>0||poSubmitting)?G.textLight:"#fff",
                      transition:"background 0.15s"}}>
                    {poSubmitting?"처리 중...":"확인 및 실행"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {!showSec&&menu==="Recipients"&&(
            <div style={{maxWidth:760}}>
              {/* 헤더 */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{fontWeight:700,fontSize:15}}>
                  {recTab===0?`Recipients 등록된 수취인 (${recs.length})`:"Quota 한도 현황"}
                </div>
                {recTab===0&&<Btn t="+ 새 수취인" sm onClick={()=>{setShowAddRec(v=>{const next=!v;if(next){setRecStep(1);setNr({name:"",type:"Bank",detail:"",cur:"USD",network:"",registrationNo:"",country:"",address:"",alias:"",bankName:"",swiftCode:""});setNrQuota({docType:"Invoice",amount:"",validFrom:"",validTo:"",file:null});}setEditRecId(null);return next;});}}/>}
                {recTab===1&&<Btn t="+ 한도 신청" sm onClick={()=>{setQuotaFormRecId("new");setQuotaForm({docType:"Invoice",recipientId:"",amount:"",validFrom:"",validTo:"",file:null});}}/>}
              </div>

              {/* 탭 바 */}
              <div style={{display:"flex",borderBottom:`1.5px solid ${G.border}`,marginBottom:18}}>
                {["수취인 목록 (Recipients)","한도 관리 (Quota)"].map((label,i)=>(
                  <button key={i} onClick={()=>{setRecTab(i);setShowAddRec(false);setEditRecId(null);setQuotaFormRecId(null);}}
                    style={{padding:"9px 18px",border:"none",background:"transparent",
                      borderBottom:recTab===i?`2px solid ${G.green}`:"2px solid transparent",
                      fontWeight:recTab===i?700:400,color:recTab===i?G.greenDark:G.textMid,
                      fontSize:12,cursor:"pointer",marginBottom:-1.5}}>
                    {label}
                  </button>
                ))}
              </div>

              {/* ── TAB 1: 수취인 목록 ── */}
              {recTab===0&&(
                <div>
                  {/* 새 수취인 등록 폼 */}
                  {showAddRec&&(
                    <Card style={{marginBottom:16,border:`1.5px solid ${G.green}`}}>
                      {/* 스텝 인디케이터 */}
                      <div style={{display:"flex",alignItems:"center",marginBottom:14}}>
                        <div style={{fontWeight:700,fontSize:12,color:G.greenDark}}>➕ 새 수취인 등록</div>
                        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:4}}>
                          {[1,2].map(s=>(
                            <div key={s} style={{display:"flex",alignItems:"center",gap:4}}>
                              <div style={{width:22,height:22,borderRadius:"50%",background:recStep>=s?G.green:G.border,color:recStep>=s?"#fff":G.textMid,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{s}</div>
                              {s<2&&<div style={{width:18,height:2,background:recStep>1?G.green:G.border}}/>}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* STEP 1 */}
                      {recStep===1&&(
                        <>
                          <div style={{fontSize:11,color:G.textMid,marginBottom:12,padding:"6px 10px",background:"#F9FAFB",borderRadius:6}}>Step 1 — 기본 정보 입력 (IB 내부 저장)</div>
                          <Lbl t="이름 / 법인명 (Legal Name)*"/>
                          <Inp v={nr.name} set={v=>setNr(r=>({...r,name:v}))} ph="법인명 또는 이름"/>
                          <Lbl t="유형*"/>
                          <div style={{display:"flex",gap:7,marginBottom:10}}>
                            {["Bank","Crypto"].map(tp=>(
                              <button key={tp} onClick={()=>setNr(r=>({...r,type:tp,network:"",cur:tp==="Bank"?"USD":"USDC"}))}
                                style={{flex:1,padding:"7px",borderRadius:7,border:`1.5px solid ${nr.type===tp?G.green:G.border}`,background:nr.type===tp?G.greenLight:G.white,fontWeight:nr.type===tp?700:400,cursor:"pointer",color:nr.type===tp?G.greenDark:G.textMid,fontSize:12}}>
                                {tp==="Bank"?"🏦 Bank":"🔗 Crypto"}
                              </button>
                            ))}
                          </div>
                          <Lbl t="사업자등록번호 (Registration No.)*"/>
                          <Inp v={nr.registrationNo} set={v=>setNr(r=>({...r,registrationNo:v}))} ph="예: 110-81-12345"/>
                          <Lbl t="국가 (Country Code)*"/>
                          <Inp v={nr.country} set={v=>setNr(r=>({...r,country:v}))} ph="ISO alpha-2 (예: KR, US, SG)"/>
                          <div style={{background:"#FFF7ED",border:"1px solid #FED7AA",borderRadius:6,padding:"7px 10px",fontSize:10,color:"#92400E",marginBottom:10}}>
                            ⚠️ 불가 국가: CU · KP · IR · SY · RU
                          </div>
                          <Lbl t="주소*"/>
                          <Inp v={nr.address} set={v=>setNr(r=>({...r,address:v}))} ph="법인 주소"/>
                          <Lbl t="별칭 (Alias)"/>
                          <Inp v={nr.alias} set={v=>setNr(r=>({...r,alias:v}))} ph="검색용 별명 (선택)"/>
                          <Lbl t="통화*"/>
                          <Sel v={nr.cur} set={v=>setNr(r=>({...r,cur:v,network:""}))} opts={nr.type==="Bank"?["USD"]:["USDC","USDT"]}/>
                          <Lbl t={nr.type==="Bank"?"계좌번호*":"지갑 주소*"}/>
                          <Inp v={nr.detail} set={v=>setNr(r=>({...r,detail:v}))} ph={nr.type==="Bank"?"계좌번호":"0x..."}/>
                          {nr.type==="Crypto"&&<NetSelector cur={nr.cur} net={nr.network} setNet={v=>setNr(r=>({...r,network:v}))}/>}
                          {nr.type==="Bank"&&(<>
                            <Lbl t="은행명*"/>
                            <Inp v={nr.bankName} set={v=>setNr(r=>({...r,bankName:v}))} ph="예: Citibank"/>
                            <Lbl t="SWIFT 코드*"/>
                            <Inp v={nr.swiftCode} set={v=>setNr(r=>({...r,swiftCode:v}))} ph="예: CITIKRSX"/>
                          </>)}
                          <div style={{display:"flex",gap:7,marginTop:4}}>
                            <Btn t="다음 →" sm onClick={()=>{
                              const BLOCKED=["CU","KP","IR","SY","RU"];
                              if(!nr.name||!nr.registrationNo||!nr.country||!nr.address||!nr.detail){T("⚠️ 필수 항목을 입력하세요");return;}
                              if(BLOCKED.includes(nr.country.toUpperCase())){T("⚠️ 해당 국가는 송금이 불가합니다");return;}
                              if(nr.type==="Bank"&&(!nr.bankName||!nr.swiftCode)){T("⚠️ 은행명과 SWIFT 코드를 입력하세요");return;}
                              if(nr.type==="Crypto"&&!nr.network){T("⚠️ 네트워크를 선택하세요");return;}
                              setRecStep(2);
                            }}/>
                            <Btn t="취소" sm color={G.textLight} onClick={()=>{setShowAddRec(false);setRecStep(1);}}/>
                          </div>
                        </>
                      )}

                      {/* STEP 2 */}
                      {recStep===2&&(
                        <>
                          <div style={{fontSize:11,color:G.textMid,marginBottom:8,padding:"6px 10px",background:"#F9FAFB",borderRadius:6}}>Step 2 — 한도 신청 (Quota Application)</div>
                          <div style={{background:G.blueLight,border:`1px solid #BFDBFE`,borderRadius:7,padding:"9px 11px",fontSize:10,color:"#1D4ED8",marginBottom:12}}>
                            ℹ️ 수취인에게 송금하려면 OSL에 한도(Quota)를 사전 신청해야 합니다. 인보이스 또는 계약서를 업로드하여 송금 한도를 설정합니다.
                          </div>
                          <Lbl t="서류 유형*"/>
                          <div style={{display:"flex",gap:7,marginBottom:10}}>
                            {["Invoice","Contract"].map(dt=>(
                              <button key={dt} onClick={()=>setNrQuota(q=>({...q,docType:dt}))}
                                style={{flex:1,padding:"7px",borderRadius:7,border:`1.5px solid ${nrQuota.docType===dt?G.green:G.border}`,background:nrQuota.docType===dt?G.greenLight:G.white,fontWeight:nrQuota.docType===dt?700:400,cursor:"pointer",color:nrQuota.docType===dt?G.greenDark:G.textMid,fontSize:12}}>
                                {dt}
                              </button>
                            ))}
                          </div>
                          <Lbl t="통화"/>
                          <div style={{padding:"8px 11px",borderRadius:7,border:`1px solid ${G.border}`,fontSize:12,marginBottom:10,background:"#F9FAFB",color:G.textMid}}>USD (고정)</div>
                          <Lbl t="신청 한도 금액 (USD)*"/>
                          <Inp v={nrQuota.amount} set={v=>setNrQuota(q=>({...q,amount:v}))} ph="0.01 ~ 999,999,999.99"/>
                          <div style={{display:"flex",gap:8}}>
                            <div style={{flex:1}}><Lbl t="유효 시작일"/><Inp v={nrQuota.validFrom} set={v=>setNrQuota(q=>({...q,validFrom:v}))} ph="yyyy-MM-dd"/></div>
                            <div style={{flex:1}}><Lbl t="유효 종료일"/><Inp v={nrQuota.validTo} set={v=>setNrQuota(q=>({...q,validTo:v}))} ph="yyyy-MM-dd"/></div>
                          </div>
                          <Lbl t="서류 업로드 (PDF / JPG / PNG, max 10MB)*"/>
                          <div style={{border:`1.5px dashed ${G.border}`,borderRadius:7,padding:"16px",textAlign:"center",marginBottom:10,background:"#FAFAFA",fontSize:11,color:G.textMid,cursor:"pointer"}}
                            onClick={()=>document.getElementById("nrq-file").click()}>
                            {nrQuota.file?`📎 ${nrQuota.file}`:"파일 선택 또는 드래그 앤 드롭"}
                            <input id="nrq-file" type="file" accept=".pdf,.jpg,.jpeg,.png" style={{display:"none"}}
                              onChange={e=>{if(e.target.files[0])setNrQuota(q=>({...q,file:e.target.files[0].name}));}}/>
                          </div>
                          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                            <Btn t="한도 신청 완료" sm onClick={()=>{
                              if(!nrQuota.amount){T("⚠️ 한도 금액을 입력하세요");return;}
                              if(!nrQuota.file){T("⚠️ 서류를 업로드하세요");return;}
                              const newRec={id:Date.now(),...nr,counterpartyStatus:"PENDING"};
                              const newQ={id:Date.now()+1,recipientId:newRec.id,recipientName:nr.name,registrationNo:nr.registrationNo,docType:nrQuota.docType,totalApproved:parseFloat(nrQuota.amount)||0,usedAmount:0,frozenAmount:0,status:"PENDING",validFrom:nrQuota.validFrom,validTo:nrQuota.validTo};
                              setRecs(rs=>[...rs,newRec]);setQuotas(qs=>[...qs,newQ]);
                              setShowAddRec(false);setRecStep(1);
                              T("✅ 한도 신청이 제출되었습니다. 승인 후 해당 수취인으로 송금이 가능합니다.");
                            }}/>
                            <Btn t="나중에 신청" sm color={G.textMid} onClick={()=>{
                              const newRec={id:Date.now(),...nr,counterpartyStatus:"PENDING"};
                              setRecs(rs=>[...rs,newRec]);
                              setShowAddRec(false);setRecStep(1);
                              T("✅ 수취인 등록 완료. 한도를 나중에 신청하세요.");
                            }}/>
                            <Btn t="← 이전" sm color={G.textLight} onClick={()=>setRecStep(1)}/>
                          </div>
                        </>
                      )}
                    </Card>
                  )}

                  {/* 수취인 카드 목록 */}
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {recs.map(r=>(
                      <div key={r.id} style={{background:G.white,border:`1.5px solid ${editRecId===r.id?"#6FCF4A":G.border}`,borderRadius:10,overflow:"hidden",transition:"border 0.15s"}}>
                        {/* 카드 메인 */}
                        <div style={{padding:"14px 16px",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
                          <div style={{display:"flex",alignItems:"flex-start",gap:12,flex:1,minWidth:0}}>
                            <span style={{fontSize:20,flexShrink:0,marginTop:1}}>{r.type==="Bank"?"🏦":"🔗"}</span>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:4}}>
                                <div style={{fontWeight:700,fontSize:13}}>{r.name}</div>
                                <span style={{fontSize:10,padding:"1px 7px",borderRadius:10,background:r.type==="Bank"?"#EFF6FF":"#F3E8FF",color:r.type==="Bank"?"#1D4ED8":"#7C3AED",fontWeight:600}}>{r.type}</span>
                                <CounterpartyStatusBadge status={r.counterpartyStatus}/>
                              </div>
                              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                                <CIcon c={r.cur}/><span style={{fontSize:11,fontWeight:600,color:G.textMid}}>{r.cur}</span>
                                <NetBadge net={r.network}/>
                              </div>
                              <div>
                                {r.type==="Crypto"?<AddressChip address={r.detail}/>:<div style={{fontSize:10,color:G.textMid}}>{r.detail}</div>}
                              </div>
                            </div>
                          </div>
                          <div style={{display:"flex",gap:6,flexShrink:0}}>
                            <button onClick={()=>{
                              if(editRecId===r.id){setEditRecId(null);}
                              else{setEditRecId(r.id);setEr({name:r.name,type:r.type,detail:r.detail,cur:r.cur,network:r.network,alias:r.alias||""});setShowAddRec(false);}
                            }} style={{fontSize:10,padding:"4px 10px",borderRadius:5,border:`1px solid ${G.green}`,background:editRecId===r.id?G.greenLight:G.white,color:G.greenDark,cursor:"pointer",fontWeight:600}}>
                              {editRecId===r.id?"접기":"수정"}
                            </button>
                            <button onClick={()=>setDeleteConfirmId(r.id)}
                              style={{fontSize:10,padding:"4px 10px",borderRadius:5,border:`1px solid ${G.red}`,background:"#FFF5F5",color:G.red,cursor:"pointer",fontWeight:600}}>
                              삭제
                            </button>
                          </div>
                        </div>

                        {/* 인라인 편집 폼 */}
                        {editRecId===r.id&&(
                          <div style={{borderTop:`1px solid ${G.border}`,background:G.greenLight,padding:"14px 16px"}}>
                            <div style={{fontWeight:700,fontSize:11,color:G.greenDark,marginBottom:10}}>✏️ 수취인 정보 수정</div>
                            <Lbl t="이름"/>
                            <Inp v={er.name} set={v=>setEr(e=>({...e,name:v}))} ph="수취인 이름 또는 법인명"/>
                            <Lbl t="별칭 (Alias)"/>
                            <Inp v={er.alias} set={v=>setEr(e=>({...e,alias:v}))} ph="검색용 별명"/>
                            <Lbl t={er.type==="Bank"?"계좌번호":"지갑 주소"}/>
                            <Inp v={er.detail} set={v=>setEr(e=>({...e,detail:v}))} ph={er.type==="Bank"?"계좌번호":"0x..."}/>
                            <Lbl t="통화"/>
                            <Sel v={er.cur} set={v=>setEr(e=>({...e,cur:v,network:""}))} opts={er.type==="Bank"?["USD"]:["USDC","USDT"]}/>
                            {er.type==="Crypto"&&<NetSelector cur={er.cur} net={er.network} setNet={v=>setEr(e=>({...e,network:v}))}/>}
                            <div style={{fontSize:10,color:G.textMid,marginBottom:10,padding:"6px 9px",background:"#FFF7ED",border:"1px solid #FED7AA",borderRadius:6}}>
                              ⚠️ 법인명 · 사업자번호 · 국가는 수정 불가 (OSL Counterparty 등록 후)
                            </div>
                            <div style={{display:"flex",gap:7}}>
                              <Btn t="저장" sm onClick={()=>{if(!er.name||!er.detail){T("⚠️ 필수 입력");return;}setRecs(rs=>rs.map(x=>x.id===r.id?{...x,...er}:x));setEditRecId(null);T("✅ 수취인 정보 업데이트 완료");}}/>
                              <Btn t="취소" sm color={G.textLight} onClick={()=>setEditRecId(null)}/>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {recs.length===0&&(
                      <div style={{textAlign:"center",padding:"40px 20px",color:G.textLight,fontSize:12}}>
                        등록된 수취인이 없습니다.<br/>
                        <span style={{fontSize:11}}>+ 새 수취인 버튼으로 추가하세요.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── TAB 2: 한도 관리 ── */}
              {recTab===1&&(
                <div>
                  {/* 헤더 버튼으로 신규 신청 폼 */}
                  {quotaFormRecId==="new"&&(
                    <div style={{background:G.white,border:`1.5px solid ${G.green}`,borderRadius:10,padding:"16px",marginBottom:16}}>
                      <div style={{fontWeight:700,fontSize:12,color:G.greenDark,marginBottom:12}}>한도 신청 — 수취인 선택</div>
                      <Lbl t="수취인 *"/>
                      <select value={quotaForm.recipientId} onChange={e=>setQuotaForm(q=>({...q,recipientId:e.target.value}))}
                        style={{width:"100%",padding:"8px 11px",borderRadius:7,border:`1px solid ${G.border}`,fontSize:12,marginBottom:10,background:G.white,boxSizing:"border-box"}}>
                        <option value="">— 수취인 선택 —</option>
                        {recs.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                      <div style={{display:"flex",gap:7}}>
                        <Btn t="이동" sm onClick={()=>{
                          if(!quotaForm.recipientId){T("⚠️ 수취인을 선택하세요");return;}
                          setQuotaFormRecId(Number(quotaForm.recipientId));
                          setExpandedQuotaRecId(Number(quotaForm.recipientId));
                          setQuotaForm(q=>({...q,amount:"",validFrom:"",validTo:"",file:null}));
                        }}/>
                        <Btn t="취소" sm color={G.textLight} onClick={()=>setQuotaFormRecId(null)}/>
                      </div>
                    </div>
                  )}

                  {/* 수취인별 요약 카드 */}
                  {(()=>{
                    const recQuotaMap={};
                    quotas.forEach(q=>{
                      if(!recQuotaMap[q.recipientId]) recQuotaMap[q.recipientId]={recipientId:q.recipientId,recipientName:q.recipientName,registrationNo:q.registrationNo,items:[]};
                      recQuotaMap[q.recipientId].items.push(q);
                    });
                    const recGroups=Object.values(recQuotaMap);
                    if(recGroups.length===0) return(
                      <div style={{textAlign:"center",padding:"40px 20px",color:G.textLight,fontSize:12}}>
                        신청된 한도가 없습니다.<br/><span style={{fontSize:11}}>+ 한도 추가 신청 버튼으로 추가하세요.</span>
                      </div>
                    );
                    return recGroups.map(group=>{
                      const totalApproved=group.items.filter(q=>q.status==="ACTIVE").reduce((s,q)=>s+q.totalApproved,0);
                      const usedAmount=group.items.reduce((s,q)=>s+q.usedAmount,0);
                      const frozenAmount=group.items.reduce((s,q)=>s+q.frozenAmount,0);
                      const avail=Math.max(0,totalApproved-usedAmount+frozenAmount);
                      const pct=totalApproved>0?Math.round(avail/totalApproved*100):0;
                      const barColor=pct>=50?G.green:pct>=20?G.orange:G.red;
                      const isExpanded=expandedQuotaRecId===group.recipientId;
                      const isFormOpen=quotaFormRecId===group.recipientId;
                      const isFirstApp=group.items.length===0;
                      const newAmt=parseFloat(quotaForm.amount)||0;
                      return(
                        <div key={group.recipientId} style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,marginBottom:12,overflow:"hidden"}}>
                          {/* 카드 헤더 (클릭 시 이력 Accordion) */}
                          <div style={{padding:"16px 18px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}
                            onClick={()=>setExpandedQuotaRecId(isExpanded?null:group.recipientId)}>
                            <div>
                              <div style={{fontWeight:700,fontSize:13,color:G.textDark,marginBottom:3}}>{group.recipientName}</div>
                              <div style={{fontSize:10,color:G.textLight}}>{group.registrationNo} · USD</div>
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <div style={{textAlign:"right"}}>
                                <div style={{fontSize:10,color:G.textLight,marginBottom:1}}>잔여 한도</div>
                                <div style={{fontSize:15,fontWeight:700,color:barColor}}>${avail.toLocaleString()}</div>
                              </div>
                              <span style={{color:G.textLight,fontSize:12}}>{isExpanded?"▲":"▼"}</span>
                            </div>
                          </div>

                          {/* 요약 통계 + 프로그레스 바 */}
                          <div style={{padding:"0 18px 14px",borderBottom:`1px solid ${G.border}`}}>
                            <div style={{height:6,background:"#F3F4F6",borderRadius:4,overflow:"hidden",marginBottom:8}}>
                              <div style={{height:"100%",width:`${pct}%`,background:barColor,borderRadius:4,transition:"width 0.3s"}}/>
                            </div>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,marginBottom:10}}>
                              {[["총 승인 한도",`$${totalApproved.toLocaleString()}`],["사용액",`$${usedAmount.toLocaleString()}`],["처리 중",`$${frozenAmount.toLocaleString()}`],["잔여 한도",`$${avail.toLocaleString()}`]].map(([lbl,val])=>(
                                <div key={lbl}>
                                  <div style={{fontSize:9,color:G.textLight,marginBottom:2}}>{lbl}</div>
                                  <div style={{fontSize:12,fontWeight:700,color:G.textDark}}>{val}</div>
                                </div>
                              ))}
                            </div>
                            <div style={{display:"flex",justifyContent:"flex-end"}}>
                              <button onClick={e=>{e.stopPropagation();setQuotaFormRecId(isFormOpen?null:group.recipientId);if(!isFormOpen)setQuotaForm({docType:"Invoice",recipientId:group.recipientId,amount:"",validFrom:"",validTo:"",file:null});}}
                                style={{fontSize:10,padding:"4px 12px",borderRadius:5,border:`1px solid ${G.green}`,background:isFormOpen?G.greenLight:G.white,color:G.greenDark,cursor:"pointer",fontWeight:600}}>
                                {isFormOpen?"접기":"+ 한도 추가 신청"}
                              </button>
                            </div>
                          </div>

                          {/* Accordion: 신청 이력 서브 테이블 */}
                          {isExpanded&&(
                            <div style={{padding:"12px 16px",background:"#FAFBF8"}}>
                              <div style={{fontSize:11,fontWeight:700,color:G.textMid,marginBottom:8}}>신청 이력</div>
                              <div style={{overflowX:"auto"}}>
                                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                                  <thead>
                                    <tr style={{background:G.sidebar}}>
                                      {["신청 번호","서류 유형","신청 한도","승인 한도","사용액","잔여","유효기간","상태","서류"].map(h=>(
                                        <th key={h} style={{padding:"7px 10px",textAlign:"left",fontWeight:700,color:G.textMid,fontSize:10,borderBottom:`1px solid ${G.border}`,whiteSpace:"nowrap"}}>{h}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {group.items.map((q,qi)=>{
                                      const itemAvail=q.status==="PENDING"?null:Math.max(0,q.totalApproved-q.usedAmount+q.frozenAmount);
                                      const stC=q.status==="ACTIVE"?"#276749":q.status==="PENDING"?"#B45309":"#6B7280";
                                      const stBg=q.status==="ACTIVE"?"#EBF8E1":q.status==="PENDING"?"#FFFBEB":"#F3F4F6";
                                      return(
                                        <tr key={q.id} style={{borderBottom:`1px solid ${G.border}`,background:qi%2===0?G.white:"#FAFBF8"}}>
                                          <td style={{padding:"8px 10px",fontWeight:600,color:G.textMid,fontFamily:"monospace"}}>QA-{String(q.id).padStart(3,"0")}</td>
                                          <td style={{padding:"8px 10px"}}><span style={{background:"#EEF2FF",color:"#6366F1",borderRadius:20,padding:"2px 7px",fontSize:10,fontWeight:700}}>{q.docType}</span></td>
                                          <td style={{padding:"8px 10px",color:G.textMid}}>${(q.requestedAmount||q.totalApproved).toLocaleString()}</td>
                                          <td style={{padding:"8px 10px",fontWeight:700}}>{q.status==="PENDING"?<span style={{color:G.orange,fontSize:10}}>심사 중</span>:`$${q.totalApproved.toLocaleString()}`}</td>
                                          <td style={{padding:"8px 10px",color:G.textMid}}>${q.usedAmount.toLocaleString()}</td>
                                          <td style={{padding:"8px 10px",fontWeight:600}}>{itemAvail==null?"—":`$${itemAvail.toLocaleString()}`}</td>
                                          <td style={{padding:"8px 10px",color:G.textLight,fontSize:10,whiteSpace:"nowrap"}}>{q.validFrom&&q.validTo?`${q.validFrom} ~ ${q.validTo}`:"—"}</td>
                                          <td style={{padding:"8px 10px"}}><span style={{background:stBg,color:stC,borderRadius:20,padding:"2px 7px",fontWeight:700,fontSize:10}}>{q.status}</span></td>
                                          <td style={{padding:"8px 10px"}}>
                                            <button onClick={()=>T("📄 서류 미리보기 (Mock)")} style={{fontSize:10,padding:"3px 8px",borderRadius:4,border:`1px solid ${G.border}`,background:G.white,color:G.textMid,cursor:"pointer"}}>📄 보기</button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                  <tfoot>
                                    <tr style={{background:"#F7FBF4",fontWeight:700}}>
                                      <td colSpan={2} style={{padding:"8px 10px",fontSize:11,color:G.textMid}}>합계</td>
                                      <td style={{padding:"8px 10px"}}/>
                                      <td style={{padding:"8px 10px",fontWeight:700}}>${totalApproved.toLocaleString()}</td>
                                      <td style={{padding:"8px 10px",fontWeight:700}}>${usedAmount.toLocaleString()}</td>
                                      <td style={{padding:"8px 10px",fontWeight:700,color:barColor}}>${avail.toLocaleString()}</td>
                                      <td colSpan={3}/>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Accordion: 한도 신청 폼 */}
                          {isFormOpen&&(
                            <div style={{padding:"14px 16px",background:G.greenLight,borderTop:`1px solid ${G.border}`}} onClick={e=>e.stopPropagation()}>
                              {/* 최초 / 추가 배너 */}
                              {isFirstApp?(
                                <div style={{background:"#EBF4FF",border:"1px solid #BEE3F8",borderRadius:7,padding:"8px 12px",marginBottom:12,fontSize:11,color:"#2B6CB0"}}>
                                  📋 이 수취인에 대한 첫 번째 한도 신청입니다.
                                </div>
                              ):(
                                <div style={{background:G.greenLight,border:`1px solid ${G.border}`,borderRadius:7,padding:"8px 12px",marginBottom:12,fontSize:11,color:G.greenDark}}>
                                  ➕ 기존 한도에 추가 승인됩니다. 승인 시 총 승인 한도가 증가합니다.
                                </div>
                              )}
                              {/* 추가 신청 시 현재 한도 요약 */}
                              {!isFirstApp&&(
                                <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:7,padding:"10px 14px",marginBottom:12}}>
                                  {[["현재 총 승인 한도",`$${totalApproved.toLocaleString()} USD`],["잔여 한도",`$${avail.toLocaleString()} USD`],["이번 신청 후 예상 총 한도",`$${(totalApproved+newAmt).toLocaleString()} USD`]].map(([k,v],ki)=>(
                                    <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:ki<2?4:0}}>
                                      <span style={{fontSize:11,color:G.textMid}}>{k}</span>
                                      <span style={{fontSize:11,fontWeight:ki===2?700:600,color:ki===2?G.greenDark:G.textDark}}>{v}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {/* 폼 필드 */}
                              <Lbl t="서류 유형 *"/>
                              <div style={{display:"flex",gap:7,marginBottom:10}}>
                                {["Invoice","Contract"].map(dt=>(
                                  <button key={dt} onClick={()=>setQuotaForm(q=>({...q,docType:dt}))}
                                    style={{flex:1,padding:"7px",borderRadius:7,border:`1.5px solid ${quotaForm.docType===dt?G.green:G.border}`,background:quotaForm.docType===dt?G.white:G.white,fontWeight:quotaForm.docType===dt?700:400,cursor:"pointer",color:quotaForm.docType===dt?G.greenDark:G.textMid,fontSize:12}}>
                                    {dt}
                                  </button>
                                ))}
                              </div>
                              <Lbl t="신청 한도 (USD) *"/>
                              <Inp v={quotaForm.amount} set={v=>setQuotaForm(q=>({...q,amount:v}))} ph="0.01 ~ 999,999,999.99"/>
                              <div style={{display:"flex",gap:8}}>
                                <div style={{flex:1}}><Lbl t="유효 시작일"/><Inp v={quotaForm.validFrom} set={v=>setQuotaForm(q=>({...q,validFrom:v}))} ph="yyyy-MM-dd"/></div>
                                <div style={{flex:1}}><Lbl t="유효 종료일"/><Inp v={quotaForm.validTo} set={v=>setQuotaForm(q=>({...q,validTo:v}))} ph="yyyy-MM-dd"/></div>
                              </div>
                              <Lbl t="서류 업로드 (PDF/JPG/PNG, max 10MB) *"/>
                              <div style={{border:`1.5px dashed ${G.border}`,borderRadius:7,padding:"14px",textAlign:"center",marginBottom:12,background:G.white,fontSize:11,color:G.textMid,cursor:"pointer"}}
                                onClick={()=>document.getElementById(`qf-sub-${group.recipientId}`).click()}>
                                {quotaForm.file?`📎 ${quotaForm.file}`:"파일 선택 또는 드래그 앤 드롭"}
                                <input id={`qf-sub-${group.recipientId}`} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{display:"none"}}
                                  onChange={e=>{if(e.target.files[0])setQuotaForm(q=>({...q,file:e.target.files[0].name}));}}/>
                              </div>
                              <div style={{display:"flex",gap:7}}>
                                <Btn t="신청 완료" sm onClick={()=>{
                                  if(!quotaForm.amount){T("⚠️ 한도 금액을 입력하세요");return;}
                                  if(!quotaForm.file){T("⚠️ 서류를 업로드하세요");return;}
                                  const nAmt=parseFloat(quotaForm.amount)||0;
                                  setQuotas(qs=>[...qs,{id:Date.now(),recipientId:group.recipientId,recipientName:group.recipientName,registrationNo:group.registrationNo,docType:quotaForm.docType,requestedAmount:nAmt,totalApproved:nAmt,usedAmount:0,frozenAmount:0,status:"PENDING",validFrom:quotaForm.validFrom,validTo:quotaForm.validTo}]);
                                  setQuotaFormRecId(null);
                                  T("✅ 한도 신청이 제출되었습니다. 승인 후 총 한도에 합산됩니다.");
                                }}/>
                                <Btn t="취소" sm color={G.textLight} onClick={()=>setQuotaFormRecId(null)}/>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              )}

              {/* 삭제 확인 모달 */}
              {deleteConfirmId&&(()=>{
                const target=recs.find(r=>r.id===deleteConfirmId);
                return(
                  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9998}}>
                    <div style={{background:G.white,borderRadius:14,padding:28,maxWidth:340,width:"90%",boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>
                      <div style={{fontWeight:700,fontSize:14,marginBottom:10}}>수취인 삭제</div>
                      <div style={{fontSize:12,color:G.textMid,marginBottom:6}}>'{target?.name}' 수취인을 삭제하시겠습니까?</div>
                      <div style={{fontSize:11,color:G.red,marginBottom:20}}>이 작업은 되돌릴 수 없습니다.</div>
                      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                        <Btn t="취소" sm color={G.textMid} onClick={()=>setDeleteConfirmId(null)}/>
                        <Btn t="삭제" sm color={G.red} onClick={()=>{
                          setRecs(rs=>rs.filter(x=>x.id!==deleteConfirmId));
                          if(editRecId===deleteConfirmId)setEditRecId(null);
                          setDeleteConfirmId(null);
                          T("🗑 수취인 삭제 완료");
                        }}/>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

        </div>
      </div>

      {/* 사이드 패널 */}
      {selectedTx&&<OrderSidePanel tx={selectedTx} onClose={()=>setSelectedTx(null)}/>}

      {toast&&<div style={{position:"fixed",bottom:20,right:20,background:"#1A1A1A",color:"#fff",borderRadius:8,padding:"10px 18px",fontSize:12,fontWeight:600,boxShadow:"0 4px 16px rgba(0,0,0,0.15)",zIndex:9999}}>{toast}</div>}
    </div>
  );
}

function MasterDash({onLogout,onSub}){
  const [menu,setMenu]=useState("Overview");
  const [trF,setTrF]=useState("All");
  const [selectedTx,setSelectedTx]=useState(null);
  const [clients,setClients]=useState(INIT_CLIENTS);
  const [editMu,setEditMu]=useState(null);
  const [editFee,setEditFee]=useState(null);
  const [showCreate,setShowCreate]=useState(false);
  const [nc,setNc]=useState({name:"",muOn:0.10,muOff:0.10});
  const [inviteClientId,setInviteClientId]=useState(null);
  const [inviteEmail,setInviteEmail]=useState("");
  const [clientDeleteId,setClientDeleteId]=useState(null);
  const [kybTargetId,setKybTargetId]=useState(null);
  const [kybSection,setKybSection]=useState(1);
  const [kybForm,setKybForm]=useState({enterpriseName:"",enterpriseNameEn:"",registrationNumber:"",enterpriseType:"주식회사",establishmentDate:"",officeCountry:"KR",officialAddress:"",registrationAddress:"",registrationCity:"",industry:"핀테크/송금",fundsSource:"영업 수익",accountPurpose:"해외 송금",tradingFrequency:"월 1~5회",transactionAmount:"$0 ~ $10,000",bearerShare:"N",email:"",ip:"203.0.113.1",deviceId:"DEV-A1B2C3D4"});
  const [kybDocs,setKybDocs]=useState({incorporation:null,businessReg:null,bylaws:null,companyExtract:null,orgChart:null,shareholding:null,license:null,bankStatement:null});
  const [kybPersons,setKybPersons]=useState([]);
  const [kybCompanies,setKybCompanies]=useState([]);
  const [kybNoCompany,setKybNoCompany]=useState(false);
  const [kybErrors,setKybErrors]=useState([]);
  const [kybSumsubWarn,setKybSumsubWarn]=useState(false);
  const [mtrFrom,setMtrFrom]=useState("Master");
  const [mtrTo,setMtrTo]=useState("Hanpass");
  const [mtrCur,setMtrCur]=useState("USD");
  const [mtrNet,setMtrNet]=useState("");
  const [mtrAmt,setMtrAmt]=useState("");
  const [mtrNote,setMtrNote]=useState("");
  const [mcvFrom,setMcvFrom]=useState("USD");
  const [mcvFromNet,setMcvFromNet]=useState("");
  const [mcvTo,setMcvTo]=useState("USDC");
  const [mcvToNet,setMcvToNet]=useState("ERC-20");
  const [mcvAmt,setMcvAmt]=useState("");
  const [mcvLoading,setMcvLoading]=useState(false);
  const [mcvRateError,setMcvRateError]=useState(false);
  const [mcvFilter,setMcvFilter]=useState("All");
  const [mcvHistory,setMcvHistory]=useState(MASTER_CV_DATA);
  const [mpoType,setMpoType]=useState("Fiat");
  const [mpoCur,setMpoCur]=useState("USD");
  const [mpoNet,setMpoNet]=useState("");
  const [mpoRec,setMpoRec]=useState("");
  const [mpoAmt,setMpoAmt]=useState("");
  const [masterRecs,setMasterRecs]=useState(INIT_RECIP);
  const [toast,setToast]=useState(null);
  const [showMpoOtp,setShowMpoOtp]=useState(false);
  const [mpoOtp,setMpoOtp]=useState(["","","","","",""]);
  const [mpoOtpFail,setMpoOtpFail]=useState(0);
  const [mpoCooldown,setMpoCooldown]=useState(0);
  const [mpoSubmitting,setMpoSubmitting]=useState(false);
  const [mpoFeeLoading,setMpoFeeLoading]=useState(false);
  const [mpoGasFee,setMpoGasFee]=useState(null);
  const [mpoFeeError,setMpoFeeError]=useState(false);
  const [mpoPurpose,setMpoPurpose]=useState("TREASURY");
  const [masterRecTab,setMasterRecTab]=useState(0);
  const [masterQuotas,setMasterQuotas]=useState(INIT_QUOTA);
  const [showAddMasterRec,setShowAddMasterRec]=useState(false);
  const [masterRecStep,setMasterRecStep]=useState(1);
  const [masterNr,setMasterNr]=useState({name:"",type:"Bank",detail:"",cur:"USD",network:"",registrationNo:"",country:"",address:"",alias:"",bankName:"",swiftCode:""});
  const [masterNrQuota,setMasterNrQuota]=useState({docType:"Invoice",purpose:"TREASURY",amount:"",validFrom:"",validTo:"",file:null});
  const [masterEditRecId,setMasterEditRecId]=useState(null);
  const [masterEr,setMasterEr]=useState({name:"",type:"Bank",detail:"",cur:"USD",network:"",alias:""});
  const [masterDeleteConfirmId,setMasterDeleteConfirmId]=useState(null);
  const [masterQuotaFormRecId,setMasterQuotaFormRecId]=useState(null);
  const [masterQuotaForm,setMasterQuotaForm]=useState({docType:"Invoice",purpose:"TREASURY",recipientId:"",amount:"",validFrom:"",validTo:"",file:null});
  const [masterExpandedQuotaRecId,setMasterExpandedQuotaRecId]=useState(null);

  const T=m=>{setToast(m);setTimeout(()=>setToast(null),2500);};
  useEffect(()=>{
    if(mpoCooldown<=0)return;
    const id=setInterval(()=>setMpoCooldown(s=>{if(s<=1){clearInterval(id);return 0;}return s-1;}),1000);
    return()=>clearInterval(id);
  },[mpoCooldown]);
  useEffect(()=>{
    if(mpoType!=="Crypto"||!mpoAmt||!mpoNet){setMpoGasFee(null);setMpoFeeLoading(false);setMpoFeeError(false);return;}
    setMpoFeeLoading(true);setMpoGasFee(null);setMpoFeeError(false);
    const GAS_FEE={"ERC-20":"3.50","Base":"0.05","TRC-20":"1.00","SPL":"0.50"};
    const t=setTimeout(()=>{setMpoGasFee(GAS_FEE[mpoNet]||"0.05");setMpoFeeLoading(false);},500);
    return()=>clearTimeout(t);
  },[mpoType,mpoAmt,mpoNet]);
  useEffect(()=>{
    if(!mcvAmt||isNaN(parseFloat(mcvAmt))){setMcvLoading(false);setMcvRateError(false);return;}
    setMcvLoading(true);setMcvRateError(false);
    const t=setTimeout(()=>setMcvLoading(false),500);
    return()=>clearTimeout(t);
  },[mcvAmt,mcvFrom,mcvTo]);
  const allTr=trF==="All"?TR:TR.filter(t=>t.st===trF);
  const mcvFiltered=mcvFilter==="All"?mcvHistory:mcvHistory.filter(t=>t.st===mcvFilter);
  const nav=[{g:"Overview",items:["Overview"]},{g:"Operations",items:["Transfer","Deposit","Convert","Payout","Recipients"]},{g:"Management",items:["Clients","All Transfers","All Orders","Fee Settings","Sub KYB"]}];
  const menuLabel={Overview:"Master Overview",Transfer:"Master Transfer",Deposit:"Deposit Instructions",Convert:"Convert",Payout:"Create Payout",Recipients:"Recipients",Clients:"Sub Accounts",["All Transfers"]:"All Transfers",["All Orders"]:"All Orders",["Fee Settings"]:"Fee Settings",["Sub KYB"]:"Sub Account KYB"};

  const mpoRecObj=masterRecs.find(r=>String(r.id)===String(mpoRec));
  const mpoRecName=mpoRecObj?.name||"—";
  const mpoNetDisplay=mpoType==="Fiat"?"SWIFT":(mpoNet||"—");
  const mpoOtpFilled=mpoOtp.every(d=>d!=="");
  const closeMpoOtp=()=>{setShowMpoOtp(false);setMpoOtp(["","","","","",""]);setMpoOtpFail(0);setMpoCooldown(0);setMpoSubmitting(false);setMpoGasFee(null);setMpoFeeError(false);};
  const submitMpoOtp=()=>{
    if(mpoSubmitting||mpoCooldown>0)return;
    setMpoSubmitting(true);
    const code=mpoOtp.join("");
    setTimeout(()=>{
      if(code==="123456"){
        T(`✅ Payout ${Number(mpoAmt).toLocaleString()} ${mpoCur} 제출 완료`);
        setShowMpoOtp(false);setMpoAmt("");setMpoRec("");setMpoNet("");setMpoOtp(["","","","","",""]);setMpoOtpFail(0);setMpoSubmitting(false);setMpoGasFee(null);setMpoFeeError(false);
      } else {
        const next=mpoOtpFail+1;
        setMpoOtpFail(next);
        setMpoOtp(["","","","","",""]);
        setMpoSubmitting(false);
        if(next>=3){setMpoCooldown(30);T("🔒 잠시 후 다시 시도하세요 (30초)");}
        else{T(`⚠️ 인증 코드가 올바르지 않습니다. 다시 시도하세요 (${3-next}회 남음)`);}
      }
    },600);
  };

  return(
    <div style={{display:"flex",height:"100vh",fontFamily:"'Inter',sans-serif",fontSize:12,background:G.white}}>
      <div style={{width:188,background:"#1A1A1A",display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"14px 13px 11px",borderBottom:"1px solid #333"}}>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <img src={ibLogo} alt="InfiniteBlock" style={{width:28,height:28,borderRadius:6,objectFit:"contain"}}/>
            <div><div style={{fontWeight:700,fontSize:11,color:"#fff"}}>InfiniteBlock</div><div style={{fontSize:9,color:"#888"}}>Master Admin</div></div>
          </div>
        </div>
        <div style={{flex:1,padding:"9px 11px",overflowY:"auto"}}>
          {nav.map(({g,items})=>(
            <div key={g} style={{marginBottom:10}}>
              <div style={{fontSize:9,color:"#666",fontWeight:700,textTransform:"uppercase",letterSpacing:0.6,marginBottom:3}}>{g}</div>
              {items.map(item=>(
                <div key={item} onClick={()=>{setMenu(item);setShowMpoOtp(false);setMpoOtp(["","","","","",""]);setMpoOtpFail(0);setMpoCooldown(0);setMpoSubmitting(false);}} style={{padding:"6px 8px",borderRadius:5,cursor:"pointer",marginBottom:2,background:menu===item?"#333":"transparent",color:menu===item?"#fff":"#aaa",fontWeight:menu===item?600:400,fontSize:11,borderLeft:menu===item?`3px solid ${G.green}`:"3px solid transparent"}}>{menuLabel[item]}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{padding:"9px 11px",borderTop:"1px solid #333",display:"flex",flexDirection:"column",gap:5}}>
          <button onClick={onSub} style={{padding:"6px",background:G.greenLight,color:G.greenDark,border:"none",borderRadius:6,fontWeight:700,fontSize:10,cursor:"pointer"}}>👤 Sub View</button>
          <button onClick={onLogout} style={{padding:"6px",background:"transparent",color:G.red,border:`1px solid ${G.red}`,borderRadius:6,fontWeight:700,fontSize:10,cursor:"pointer"}}>로그아웃</button>
        </div>
      </div>

      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{height:46,borderBottom:`1px solid ${G.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",background:G.white,flexShrink:0}}>
          <div style={{fontWeight:700,fontSize:14}}>{menuLabel[menu]}</div>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <div style={{background:"#1A1A1A",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:600,color:"#fff"}}>Master</div>
            <div style={{width:28,height:28,background:"#1A1A1A",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:11}}>M</div>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:20,background:"#FAFBF8"}}>

          {menu==="Overview"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                <MiniBalCards balances={MASTER_BAL} title="Master Balance"/>
                <Card>
                  <div style={{fontSize:10,fontWeight:700,color:G.textLight,textTransform:"uppercase",marginBottom:10}}>Sub Account Summary</div>
                  {INIT_CLIENTS.filter(c=>c.st==="Active").map(c=>(
                    <div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${G.border}`}}>
                      <span style={{fontWeight:600,fontSize:12}}>{c.name}</span>
                      <Badge t={c.st} color={stColor(c.st)}/>
                    </div>
                  ))}
                </Card>
              </div>
              <div style={{fontWeight:700,fontSize:12,marginBottom:8}}>Recent Orders</div>
              <TxTable rows={TX_DATA.slice(0,5)} showAcct={true} onSelect={setSelectedTx}/>
            </div>
          )}

          {menu==="Transfer"&&(
            <div style={{maxWidth:460}}>
              <Card>
                <div style={{fontWeight:700,fontSize:13,marginBottom:14}}>Master Transfer</div>
                <Lbl t="From"/>
                <Sel v={mtrFrom} set={v=>{setMtrFrom(v);setMtrTo(v==="Master"?Object.keys(ACCOUNTS)[0]:"Master");}} opts={["Master",...Object.keys(ACCOUNTS)]}/>
                <Lbl t="To"/>
                <Sel v={mtrTo} set={setMtrTo} opts={mtrFrom==="Master"?Object.keys(ACCOUNTS):["Master"]}/>
                <Lbl t="Currency"/><Sel v={mtrCur} set={v=>{setMtrCur(v);setMtrNet(NETWORKS[v]?.[0]||"");}} opts={["USD","USDC","USDT"]}/>
                <NetSelector cur={mtrCur} net={mtrNet} setNet={setMtrNet}/>
                <Lbl t="Amount"/><Inp v={mtrAmt} set={setMtrAmt} ph="Enter amount"/>
                <Lbl t="Note"/><Inp v={mtrNote} set={setMtrNote} ph="e.g. Liquidity top-up"/>
                <div style={{fontSize:10,color:"#2B6CB0",background:"#EBF4FF",borderRadius:6,padding:"6px 10px",marginBottom:10}}>ℹ️ Internal Transfer 수수료 없음.</div>
                <Btn t="Execute Transfer" onClick={()=>{if(!mtrAmt){T("⚠️ 금액 입력");return;}T(`✅ ${mtrAmt} ${mtrCur}${mtrNet?" ("+mtrNet+")":""}: ${mtrFrom}→${mtrTo}`);setMtrAmt("");setMtrNote("");}}/>
              </Card>
            </div>
          )}

          {menu==="Deposit"&&(
            <DepositInstruction isMaster={true}/>
          )}

          {menu==="Convert"&&(()=>{
            const mcvAmtNum=parseFloat((mcvAmt||"").replace(/,/g,""))||0;
            const mcvFromBal=mcvFrom==="USD"?MASTER_BAL.USD.total:mcvFrom==="USDC"?totalBal(MASTER_BAL.USDC):mcvFrom==="USDT"?totalBal(MASTER_BAL.USDT):0;
            const mcvOverBal=mcvAmtNum>0&&mcvAmtNum>mcvFromBal;
            const isOnRamp=["USD","HKD"].includes(mcvFrom)&&["USDC","USDT"].includes(mcvTo);
            const feeRate=isOnRamp?0:0.002;
            const feePct=(feeRate*100).toFixed(2);
            const feeDir=isOnRamp?"On-ramp · OSL 0%":"Off-ramp · OSL 0.2%";
            const received=(mcvAmtNum*(1-feeRate)*0.9998).toFixed(2);
            const totalFeeAmt=(mcvAmtNum*feeRate).toFixed(2);
            const canSubmit=!!mcvAmt&&!mcvOverBal&&!mcvLoading&&!mcvRateError;
            return(
            <div>
              {/* 잔액 요약 */}
              <div style={{background:G.greenLight,border:`1px solid ${G.border}`,borderRadius:10,padding:"12px 18px",marginBottom:16,display:"flex",gap:28,flexWrap:"wrap"}}>
                {[{c:"USD",v:MASTER_BAL.USD.total},{c:"USDC",v:totalBal(MASTER_BAL.USDC)},{c:"USDT",v:totalBal(MASTER_BAL.USDT)}].map(({c,v})=>(
                  <div key={c} style={{display:"flex",alignItems:"center",gap:8}}>
                    <CIcon c={c} size={20}/>
                    <div>
                      <div style={{fontSize:9,color:G.textLight,fontWeight:600,textTransform:"uppercase"}}>{c}</div>
                      <div style={{fontSize:14,fontWeight:700,color:G.textDark}}>{v.toLocaleString("en-US",{minimumFractionDigits:2})}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 환전 폼 */}
              <div style={{maxWidth:440,marginBottom:24}}>
                <Card>
                  <div style={{fontWeight:700,fontSize:13,marginBottom:14}}>Convert</div>
                  {/* FROM */}
                  <Lbl t="FROM — 통화"/>
                  <Sel v={mcvFrom} set={v=>{setMcvFrom(v);setMcvFromNet(NETWORKS[v]?.[0]||"");setMcvTo((v==="USD"||v==="HKD")?"USDC":"USD");setMcvToNet(NETWORKS[(v==="USD"||v==="HKD")?"USDC":"USD"]?.[0]||"");setMcvAmt("");}} opts={["USD","HKD","USDC","USDT"]}/>
                  {NETWORKS[mcvFrom]?.length>0&&(
                    <div style={{display:"flex",gap:7,marginBottom:10}}>
                      {NETWORKS[mcvFrom].map(n=>{const {bg,text}=NET_COLOR[n];return(
                        <button key={n} onClick={()=>setMcvFromNet(n)} style={{flex:1,padding:"7px",borderRadius:7,border:`1.5px solid ${mcvFromNet===n?text:G.border}`,background:mcvFromNet===n?bg:G.white,color:mcvFromNet===n?text:G.textMid,fontWeight:mcvFromNet===n?700:400,fontSize:12,cursor:"pointer"}}>{n}</button>
                      );})}
                    </div>
                  )}
                  {/* ↕ 방향 전환 */}
                  <div style={{textAlign:"center",margin:"2px 0 6px"}}>
                    <button onClick={()=>{const[f,fn,t,tn]=[mcvFrom,mcvFromNet,mcvTo,mcvToNet];setMcvFrom(t);setMcvFromNet(tn);setMcvTo(f);setMcvToNet(fn);setMcvAmt("");}} style={{background:G.greenLight,border:`1px solid ${G.border}`,borderRadius:20,padding:"4px 14px",cursor:"pointer",fontSize:15,color:G.greenDark,fontWeight:700}}>↕</button>
                  </div>
                  {/* TO */}
                  <Lbl t="TO — 통화"/>
                  <Sel v={mcvTo} set={v=>{setMcvTo(v);setMcvToNet(NETWORKS[v]?.[0]||"");setMcvAmt("");}} opts={["USD","HKD","USDC","USDT"].filter(c=>c!==mcvFrom)}/>
                  {NETWORKS[mcvTo]?.length>0&&(
                    <div style={{display:"flex",gap:7,marginBottom:10}}>
                      {NETWORKS[mcvTo].map(n=>{const {bg,text}=NET_COLOR[n];return(
                        <button key={n} onClick={()=>setMcvToNet(n)} style={{flex:1,padding:"7px",borderRadius:7,border:`1.5px solid ${mcvToNet===n?text:G.border}`,background:mcvToNet===n?bg:G.white,color:mcvToNet===n?text:G.textMid,fontWeight:mcvToNet===n?700:400,fontSize:12,cursor:"pointer"}}>{n}</button>
                      );})}
                    </div>
                  )}
                  <Lbl t="금액"/><Inp v={mcvAmt} set={setMcvAmt} ph="숫자 입력"/>
                  {mcvOverBal&&<div style={{color:G.red,fontSize:11,marginBottom:8}}>⚠️ 가용 잔액을 초과했습니다.</div>}
                  {mcvRateError&&<div style={{color:G.red,fontSize:11,marginBottom:8}}>⚠️ 환율을 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.</div>}
                  {/* 수수료 미리보기 */}
                  {mcvAmt&&!mcvOverBal&&(
                    <div style={{background:G.greenLight,border:`1px solid ${G.border}`,borderRadius:10,padding:"12px 16px",marginBottom:12}}>
                      <div style={{fontSize:10,fontWeight:700,color:G.textLight,textTransform:"uppercase",marginBottom:8}}>환율/수수료 요약</div>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,gap:8}}>
                        <span style={{fontSize:11,color:G.textMid,flexShrink:0}}>환율</span>
                        <span style={{fontSize:11,fontWeight:600,color:G.textDark,textAlign:"right"}}>{mcvLoading?"계산 중...":`1 ${mcvFrom} = 0.9998 ${mcvTo} (실시간 OSL fetch-rate)`}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,gap:8}}>
                        <span style={{fontSize:11,color:G.textMid,flexShrink:0}}>{isOnRamp?"On-ramp Fee":"Off-ramp Fee"}</span>
                        <span style={{fontSize:11,fontWeight:700,color:G.orange,textAlign:"right"}}>
                          {mcvLoading?"계산 중...":`${feePct}% (OSL + IB Markup 합산)`}
                        </span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:8,borderTop:`1px solid ${G.border}`}}>
                        <span style={{fontSize:12,fontWeight:700}}>예상 수취량</span>
                        <div style={{display:"flex",alignItems:"center",gap:4}}>
                          {mcvLoading?<span style={{fontSize:14,color:G.textLight}}>계산 중...</span>:<>
                            <span style={{fontSize:14,fontWeight:700,color:G.greenDark}}>{received}</span>
                            <CIcon c={mcvTo} size={16}/><span style={{fontSize:12,fontWeight:600,color:G.greenDark}}>{mcvTo}</span>
                            {mcvToNet&&<NetBadge net={mcvToNet}/>}
                          </>}
                        </div>
                      </div>
                      <div style={{fontSize:9,color:G.textLight,marginTop:4}}>금액 × (1 - 수수료율) 실시간 계산</div>
                    </div>
                  )}
                  <button
                    disabled={!canSubmit}
                    onClick={()=>{
                      if(!canSubmit)return;
                      const msg=`${mcvAmtNum.toLocaleString()} ${mcvFrom}${mcvFromNet?" ("+mcvFromNet+")":""} → ${received} ${mcvTo}${mcvToNet?" ("+mcvToNet+")":""} 으로 환전하시겠습니까?`;
                      if(!window.confirm(msg))return;
                      const newTx={
                        id:`MCV-${String(mcvHistory.length+1).padStart(3,"0")}`,
                        date:new Date().toISOString().replace("T"," ").slice(0,16),
                        type:"Convert",acct:"Master",
                        recipientName:"—",recipientAccount:null,recipientBank:null,
                        amt:`+${received}`,cur:mcvTo,network:mcvToNet||"",st:"Pending",
                        txid:"Pending...",
                        fromName:null,fromAccount:null,fromBank:null,
                        fromAmt:mcvAmtNum.toLocaleString(),fromCur:mcvFrom,fromNet:mcvFromNet||"",
                        fxRate:`1 ${mcvFrom} = 0.9998 ${mcvTo}`,
                        fxFee:`${feePct}% (총 ${totalFeeAmt} ${mcvFrom})`,
                      };
                      setMcvHistory(h=>[newTx,...h]);
                      setMcvAmt("");
                      T("✅ 환전 요청이 완료되었습니다.");
                    }}
                    style={{
                      width:"100%",padding:"11px",borderRadius:8,border:"none",
                      background:canSubmit?G.green:"#ccc",color:"#fff",fontWeight:700,
                      fontSize:13,cursor:canSubmit?"pointer":"not-allowed",
                    }}
                  >환전 실행</button>
                </Card>
              </div>

              {/* Convert 내역 */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div>
                  <div style={{fontWeight:700,fontSize:13,marginBottom:6}}>Convert 내역</div>
                  <div style={{display:"flex",gap:5}}>
                    {["All","Completed","Pending","Failed"].map(f=>(
                      <button key={f} onClick={()=>setMcvFilter(f)} style={{padding:"4px 10px",borderRadius:20,border:`1px solid ${mcvFilter===f?G.green:G.border}`,background:mcvFilter===f?G.greenLight:G.white,color:mcvFilter===f?G.greenDark:G.textMid,fontWeight:mcvFilter===f?700:400,cursor:"pointer",fontSize:11}}>{f}</button>
                    ))}
                  </div>
                </div>
                <Btn t="📥 Export CSV" sm onClick={()=>exportCSV(mcvFiltered,[
                  {l:"TX ID",k:"id"},{l:"Date",k:"date"},
                  {l:"From Cur",k:"fromCur"},{l:"From Amt",k:"fromAmt"},{l:"From Net",k:"fromNet"},
                  {l:"To Cur",k:"cur"},{l:"To Amt",k:"amt"},{l:"To Net",k:"network"},
                  {l:"FX Rate",k:"fxRate"},{l:"Fee",k:"fxFee"},{l:"Chain TXID",k:"txid"},{l:"Status",k:"st"},
                ],"master_convert.csv")}/>
              </div>
              <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:10,overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr style={{background:G.sidebar}}>
                    {["TX ID","Date","From → To","방향","수수료","Status"].map(h=>(
                      <th key={h} style={{padding:"9px 12px",textAlign:"left",fontWeight:700,color:G.textMid,borderBottom:`1px solid ${G.border}`}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {mcvFiltered.length===0&&(
                      <tr><td colSpan={6} style={{padding:"20px",textAlign:"center",color:G.textLight}}>내역이 없습니다.</td></tr>
                    )}
                    {mcvFiltered.map((r,i)=>{
                      const rowIsOnRamp=["USD","HKD"].includes(r.fromCur)&&["USDC","USDT"].includes(r.cur);
                      const feeStr=r.fxFee||"—";
                      const [feePctPart,feeTotalPart]=feeStr.includes("(총")?feeStr.split("(총"):["—",""];
                      const stC=stColor(r.st);
                      return(
                        <tr key={r.id}
                          onClick={()=>setSelectedTx(r)}
                          style={{background:i%2===0?G.white:"#FAFBF8",cursor:"pointer",transition:"background 0.1s"}}
                          onMouseEnter={e=>e.currentTarget.style.background=G.greenLight}
                          onMouseLeave={e=>e.currentTarget.style.background=i%2===0?G.white:"#FAFBF8"}
                        >
                          <td style={{padding:"10px 12px",fontWeight:600,color:G.textLight,fontSize:10}}>{r.id}</td>
                          <td style={{padding:"10px 12px",color:G.textMid,whiteSpace:"nowrap"}}>{r.date}</td>
                          <td style={{padding:"10px 12px"}}>
                            <div style={{display:"flex",alignItems:"center",gap:6}}>
                              <AmtChip amt={`-${r.fromAmt}`} cur={r.fromCur} net={r.fromNet||undefined} color={G.red}/>
                              <span style={{color:G.textLight}}>→</span>
                              <AmtChip amt={r.amt} cur={r.cur} net={r.network||undefined} color={G.greenDark}/>
                            </div>
                          </td>
                          <td style={{padding:"10px 12px",whiteSpace:"nowrap"}}>
                            {rowIsOnRamp
                              ?<span style={{background:"#DCFCE7",color:"#166534",borderRadius:20,padding:"2px 8px",fontWeight:700,fontSize:10}}>🟢 On-ramp</span>
                              :<span style={{background:"#DBEAFE",color:"#1D4ED8",borderRadius:20,padding:"2px 8px",fontWeight:700,fontSize:10}}>🔵 Off-ramp</span>
                            }
                          </td>
                          <td style={{padding:"10px 12px",color:G.orange,fontWeight:700,whiteSpace:"nowrap"}}>
                            {feePctPart.trim()}
                            {feeTotalPart&&<div style={{fontSize:9,color:G.textLight,fontWeight:400}}>(총 {feeTotalPart.replace(")","").trim()})</div>}
                          </td>
                          <td style={{padding:"10px 12px"}}><Badge t={r.st} color={stC}/></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            );
          })()}

          {menu==="Payout"&&(
            <div style={{maxWidth:480}}>
              <Card>
                {/* 헤더 + 스텝 상태 */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                  <div style={{fontWeight:700,fontSize:13}}>Create Payout</div>
                  <div style={{display:"flex",gap:4}}>
                    {["수취인","송금인","금액"].map((s,i)=>{
                      const done=[!!mpoRec,true,!!mpoAmt];
                      return(
                        <span key={i} style={{fontSize:9,padding:"2px 8px",borderRadius:10,background:done[i]?G.green:G.border,color:done[i]?"#fff":G.textMid,fontWeight:700,transition:"background 0.2s"}}>
                          Step {i+1}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* 송금 유형 토글 */}
                <div style={{display:"flex",gap:7,marginBottom:18}}>
                  {["Fiat","Crypto"].map(tp=>(
                    <button key={tp} onClick={()=>{setMpoType(tp);setMpoCur(tp==="Fiat"?"USD":"USDC");setMpoNet("");setMpoRec("");}}
                      style={{flex:1,padding:"9px",borderRadius:8,border:`2px solid ${mpoType===tp?G.green:G.border}`,background:mpoType===tp?G.greenLight:G.white,fontWeight:700,cursor:"pointer",color:mpoType===tp?G.greenDark:G.textMid,fontSize:12}}>
                      {tp==="Fiat"?"🏦 Fiat (Bank)":"🔗 Crypto"}
                    </button>
                  ))}
                </div>

                {/* ── Step 1: 수취인 ── */}
                <div style={{borderTop:`1px solid ${G.border}`,paddingTop:14,marginBottom:14}}>
                  <div style={{fontSize:10,fontWeight:700,color:G.green,marginBottom:12,textTransform:"uppercase",letterSpacing:0.5}}>Step 1 — 수취인 (Beneficiary)</div>
                  {masterRecs.filter(r=>mpoType==="Fiat"?r.type==="Bank":r.type==="Crypto").length===0?(
                    <div style={{background:"#FFF7ED",border:"1px solid #FED7AA",borderRadius:8,padding:"12px 14px",fontSize:11,color:"#92400E"}}>
                      등록된 수취인이 없습니다.
                      <button onClick={()=>setMenu("Recipients")} style={{marginLeft:8,fontSize:11,color:G.green,background:"none",border:"none",cursor:"pointer",fontWeight:700,textDecoration:"underline"}}>
                        Recipients에서 먼저 등록하세요 →
                      </button>
                    </div>
                  ):(
                    <>
                      <Lbl t="수취인 선택"/>
                      <select value={mpoRec} onChange={e=>setMpoRec(e.target.value)}
                        style={{width:"100%",padding:"8px 11px",borderRadius:7,border:`1px solid ${G.border}`,fontSize:12,marginBottom:10,background:G.white,boxSizing:"border-box"}}>
                        <option value="">— 수취인 선택 —</option>
                        {masterRecs.filter(r=>mpoType==="Fiat"?r.type==="Bank":r.type==="Crypto").map(r=>(
                          <option key={r.id} value={r.id}>{r.name} · {r.cur}{r.network?" ("+r.network+")":""}</option>
                        ))}
                      </select>
                      {mpoRecObj&&(
                        <div style={{background:"#F8FAFF",border:`1px solid ${G.border}`,borderRadius:8,padding:"12px 14px",marginBottom:4}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                            <span style={{fontSize:11,color:G.textMid}}>법인명</span>
                            <span style={{fontSize:11,fontWeight:700}}>{mpoRecObj.name}</span>
                          </div>
                          {mpoRecObj.type==="Bank"?(
                            <>
                              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                                <span style={{fontSize:11,color:G.textMid}}>은행</span>
                                <span style={{fontSize:11,fontWeight:600}}>{mpoRecObj.bankName||"—"}</span>
                              </div>
                              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                                <span style={{fontSize:11,color:G.textMid}}>계좌번호</span>
                                <span style={{fontSize:11,fontWeight:600,fontFamily:"monospace"}}>{mpoRecObj.detail}</span>
                              </div>
                              <div style={{display:"flex",justifyContent:"space-between"}}>
                                <span style={{fontSize:11,color:G.textMid}}>SWIFT</span>
                                <span style={{fontSize:11,fontWeight:600}}>{mpoRecObj.swiftCode||"—"}</span>
                              </div>
                            </>
                          ):(
                            <>
                              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                                <span style={{fontSize:11,color:G.textMid}}>지갑주소</span>
                                <span style={{fontSize:10,fontWeight:600,fontFamily:"monospace",wordBreak:"break-all",textAlign:"right",maxWidth:200}}>{mpoRecObj.detail}</span>
                              </div>
                              <div style={{display:"flex",justifyContent:"space-between"}}>
                                <span style={{fontSize:11,color:G.textMid}}>네트워크</span>
                                <NetBadge net={mpoRecObj.network}/>
                              </div>
                            </>
                          )}
                          {mpoRecObj.counterpartyStatus!=="ACTIVE"&&(
                            <div style={{marginTop:8,fontSize:10,color:G.orange,background:"#FFF8EE",border:"1px solid #FED7AA",borderRadius:5,padding:"5px 8px"}}>
                              ⚠️ Counterparty 상태: {mpoRecObj.counterpartyStatus}. Payout 실행 시 거부될 수 있습니다.
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* ── Step 2: 송금인 (자동 표시, 읽기 전용) ── */}
                <div style={{borderTop:`1px solid ${G.border}`,paddingTop:14,marginBottom:14}}>
                  <div style={{fontSize:10,fontWeight:700,color:G.green,marginBottom:12,textTransform:"uppercase",letterSpacing:0.5}}>Step 2 — 송금인 (Originator)</div>
                  <div style={{background:"#F8FAFF",border:`1px solid ${G.border}`,borderRadius:8,padding:"12px 14px"}}>
                    <div style={{fontSize:10,color:G.textLight,marginBottom:8}}>Master KYB 완료 — 자동 입력 (읽기 전용)</div>
                    {[["법인명","Infiniteblock Corp."],["사업자등록번호","306-88-02374"],["국가","KR"],["주소","IB 법인 주소"]].map(([k,v])=>(
                      <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${G.border}`}}>
                        <span style={{fontSize:11,color:G.textMid}}>{k}</span>
                        <span style={{fontSize:11,fontWeight:600,color:G.textDark}}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Step 3: 금액 및 통화 ── */}
                <div style={{borderTop:`1px solid ${G.border}`,paddingTop:14,marginBottom:14}}>
                  <div style={{fontSize:10,fontWeight:700,color:G.green,marginBottom:12,textTransform:"uppercase",letterSpacing:0.5}}>Step 3 — 금액 및 통화</div>
                  <Lbl t="송금 목적 (Purpose)"/>
                  <select value={mpoPurpose} onChange={e=>setMpoPurpose(e.target.value)}
                    style={{width:"100%",padding:"8px 11px",borderRadius:7,border:`1px solid ${G.border}`,fontSize:12,marginBottom:10,background:G.white,boxSizing:"border-box"}}>
                    <option value="TREASURY">TREASURY — 내부 자금 이동</option>
                    <option value="GOODS_SERVICES">GOODS_SERVICES — 재화/서비스 대금</option>
                    <option value="COMMISSION">COMMISSION — 수수료 정산</option>
                    <option value="OTHERS">OTHERS — 기타</option>
                  </select>
                  <Lbl t="통화"/><Sel v={mpoCur} set={v=>{setMpoCur(v);setMpoNet("");}} opts={mpoType==="Fiat"?["USD","HKD"]:["USDC","USDT"]}/>
                  {mpoType==="Crypto"&&<NetSelector cur={mpoCur} net={mpoNet} setNet={setMpoNet}/>}
                  <Lbl t="금액"/><Inp v={mpoAmt} set={setMpoAmt} ph={mpoType==="Fiat"?"숫자 입력 (소수점 2자리)":"숫자 입력 (소수점 6자리)"}/>
                  {(()=>{
                    const mpoAmtNum=parseFloat((mpoAmt||"0").replace(/,/g,""))||0;
                    const isLargeAmt=mpoAmtNum>=100000;
                    const NET_GAS_USD={"ERC-20":"~$2.50","Base":"~$0.10","TRC-20":"~$1.00","SPL":"~$0.05"};
                    if(mpoAmt){
                      return(
                        <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:10,padding:"14px 16px",marginBottom:12}}>
                          <div style={{fontSize:12,fontWeight:700,color:"#92400E",marginBottom:10}}>수수료 미리보기</div>
                          {mpoType==="Fiat"&&(
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                              <span style={{fontSize:11,color:G.textMid}}>Wire Fee</span>
                              <span style={{fontSize:11,fontWeight:700,color:G.orange}}>
                                {isLargeAmt?"면제 ($100K 이상)":"$35 / 건 (예치 잔액 차감)"}
                              </span>
                            </div>
                          )}
                          {mpoType==="Crypto"&&mpoNet&&(
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                              <span style={{fontSize:11,color:G.textMid}}>네트워크 수수료</span>
                              <span style={{fontSize:11,fontWeight:700,color:G.orange}}>{NET_GAS_USD[mpoNet]||"—"} USD <span style={{fontWeight:400,color:G.textLight}}>(OSL 실시간 고시)</span></span>
                            </div>
                          )}
                          <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:"1px solid #FDE68A"}}>
                            <span style={{fontSize:12,fontWeight:700}}>수취인 수령 예상액</span>
                            <span style={{fontSize:13,fontWeight:700,color:G.greenDark}}>{mpoAmtNum.toLocaleString("en-US",{minimumFractionDigits:2})} {mpoCur}</span>
                          </div>
                          {mpoType==="Fiat"&&<div style={{fontSize:10,color:"#92400E",marginTop:6}}>⏱ 환율 고정: Confirm 시점에 10분간 고정됩니다.</div>}
                          {mpoType==="Crypto"&&<div style={{fontSize:10,color:"#92400E",marginTop:6}}>※ 네트워크 수수료는 예치 잔액(USD)에서 차감됩니다.</div>}
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>

                {/* 실행 버튼 */}
                <button disabled={!mpoRec||!mpoAmt||(mpoType==="Crypto"&&!mpoNet)}
                  onClick={()=>{
                    if(!mpoRec||!mpoAmt){T("⚠️ 수취인/금액 입력");return;}
                    if(mpoType==="Crypto"&&!mpoNet){T("⚠️ 네트워크를 선택하세요");return;}
                    setShowMpoOtp(true);setMpoOtp(["","","","","",""]);setMpoOtpFail(0);setMpoCooldown(0);setMpoSubmitting(false);
                  }}
                  style={{width:"100%",padding:"12px",borderRadius:9,border:"none",fontWeight:700,fontSize:13,
                    background:(!mpoRec||!mpoAmt||(mpoType==="Crypto"&&!mpoNet))?"#ccc":G.green,
                    color:(!mpoRec||!mpoAmt||(mpoType==="Crypto"&&!mpoNet))?G.textLight:"#fff",
                    cursor:(!mpoRec||!mpoAmt||(mpoType==="Crypto"&&!mpoNet))?"not-allowed":"pointer",
                    transition:"background 0.15s"}}>
                  🚀 Payout 실행
                </button>
              </Card>
            </div>
          )}

          {/* OTP 모달 오버레이 — Master */}
          {showMpoOtp&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{background:G.white,borderRadius:16,padding:28,width:400,boxShadow:"0 8px 40px rgba(0,0,0,0.22)",position:"relative"}}>
                <div style={{fontWeight:700,fontSize:15,marginBottom:18}}>🔐 송금을 최종 확인하세요</div>
                <div style={{background:"#F8FAFF",border:`1px solid ${G.border}`,borderRadius:10,padding:"14px 16px",marginBottom:14}}>
                  {(()=>{
                    const amtN=parseFloat((mpoAmt||"0").replace(/,/g,""))||0;
                    const NET_GAS_USD_OTP={"ERC-20":"~$2.50","Base":"~$0.10","TRC-20":"~$1.00","SPL":"~$0.05"};
                    const fee=mpoType==="Fiat"?(amtN>=100000?"Wire Fee: 면제 ($100K 이상)":"Wire Fee: $35 / 건"):`네트워크 수수료: ${NET_GAS_USD_OTP[mpoNet]||"—"} USD (OSL 실시간 고시)`;
                    return [["수취인",mpoRecName],[`금액`,`${amtN.toLocaleString("en-US",{minimumFractionDigits:2})} ${mpoCur}`],["수수료",fee],["수취인 수령",`${amtN.toLocaleString("en-US",{minimumFractionDigits:2})} ${mpoCur}`],["네트워크",mpoNetDisplay]].map(([k,v])=>(
                      <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${G.border}`}}>
                        <span style={{color:G.textMid,fontSize:12}}>{k}</span>
                        <span style={{fontWeight:700,fontSize:12,color:k==="총 차감액"?G.red:G.textDark}}>{v}</span>
                      </div>
                    ));
                  })()}
                </div>
                <div style={{fontSize:10,color:G.orange,background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:7,padding:"8px 12px",marginBottom:16}}>
                  ※ 위 정보를 반드시 확인하세요. 제출 후 취소는 불가합니다.
                </div>
                <div style={{height:"1px",background:G.border,marginBottom:16}}/>
                <div style={{textAlign:"center",fontSize:12,color:G.textMid,fontWeight:600,marginBottom:4}}>Google Authenticator 앱의</div>
                <div style={{textAlign:"center",fontSize:11,color:G.textLight,marginBottom:4}}>6자리 코드를 입력하여 승인하세요</div>
                <OtpInput otp={mpoOtp} setOtp={setMpoOtp} disabled={mpoCooldown>0||mpoSubmitting}/>
                {mpoOtpFail>0&&mpoOtpFail<3&&(
                  <div style={{textAlign:"center",fontSize:11,color:G.red,marginBottom:10}}>인증 코드가 올바르지 않습니다. 다시 시도하세요</div>
                )}
                {mpoCooldown>0&&(
                  <div style={{textAlign:"center",fontSize:11,color:G.red,fontWeight:700,marginBottom:10}}>🔒 잠시 후 다시 시도하세요 ({mpoCooldown}초)</div>
                )}
                <button
                  disabled={!mpoOtpFilled||mpoCooldown>0||mpoSubmitting}
                  onClick={submitMpoOtp}
                  style={{width:"100%",padding:"12px",borderRadius:8,border:"none",fontWeight:700,fontSize:13,
                    cursor:(!mpoOtpFilled||mpoCooldown>0||mpoSubmitting)?"not-allowed":"pointer",
                    background:(!mpoOtpFilled||mpoCooldown>0||mpoSubmitting)?"#ccc":G.green,
                    color:(!mpoOtpFilled||mpoCooldown>0||mpoSubmitting)?G.textLight:"#fff",
                    marginBottom:12,transition:"background 0.15s"}}>
                  {mpoSubmitting?"처리 중...":"송금 승인"}
                </button>
                <div style={{textAlign:"center"}}>
                  <button onClick={closeMpoOtp}
                    style={{background:"none",border:"none",color:G.textMid,cursor:"pointer",fontSize:12,textDecoration:"underline"}}>
                    ← 송금 정보 수정
                  </button>
                </div>
              </div>
            </div>
          )}

          {menu==="Recipients"&&(
            <div>
              {/* 탭 헤더 */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{fontWeight:700,fontSize:13}}>
                  {masterRecTab===0?`Recipients 등록된 수취인 (${masterRecs.length})`:"Quota 한도 현황"}
                </div>
                {masterRecTab===0&&<Btn t="+ 새 수취인" sm onClick={()=>{setShowAddMasterRec(v=>{const next=!v;if(next){setMasterRecStep(1);setMasterNr({name:"",type:"Bank",detail:"",cur:"USD",network:"",registrationNo:"",country:"",address:"",alias:"",bankName:"",swiftCode:""});setMasterNrQuota({docType:"Invoice",purpose:"TREASURY",amount:"",validFrom:"",validTo:"",file:null});}setMasterEditRecId(null);return next;});}}/>}
                {masterRecTab===1&&<Btn t="+ 한도 신청" sm onClick={()=>{setMasterQuotaFormRecId("new");setMasterQuotaForm({docType:"Invoice",purpose:"TREASURY",recipientId:"",amount:"",validFrom:"",validTo:"",file:null});}}/>}
              </div>
              <div style={{display:"flex",gap:0,marginBottom:16,borderBottom:`1px solid ${G.border}`}}>
                {["수취인 목록 (Recipients)","한도 관리 (Quota)"].map((label,i)=>(
                  <button key={i} onClick={()=>setMasterRecTab(i)} style={{padding:"8px 16px",background:"transparent",border:"none",cursor:"pointer",fontSize:12,
                    borderBottom:masterRecTab===i?`2px solid ${G.green}`:"2px solid transparent",
                    fontWeight:masterRecTab===i?700:400,color:masterRecTab===i?G.greenDark:G.textMid,
                    marginBottom:-1}}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab 1 — 수취인 목록 */}
              {masterRecTab===0&&(
                <div>
                  {/* 새 수취인 등록 폼 */}
                  {showAddMasterRec&&(
                    <Card style={{marginBottom:14,border:`1.5px solid ${G.green}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                        <div style={{fontWeight:700,fontSize:12,color:G.greenDark}}>
                          새 수취인 등록 — {masterRecStep===1?"Step 1: 기본 정보":"Step 2: 한도 신청 (Quota)"}
                        </div>
                        <div style={{display:"flex",gap:4}}>
                          {[1,2].map(s=>(
                            <span key={s} style={{fontSize:9,padding:"2px 8px",borderRadius:10,background:masterRecStep>=s?G.green:G.border,color:masterRecStep>=s?"#fff":G.textMid,fontWeight:700}}>Step {s}</span>
                          ))}
                        </div>
                      </div>

                      {masterRecStep===1&&(
                        <>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                            <div style={{gridColumn:"1/-1"}}><Lbl t="법인명 (Legal Name) *"/><Inp v={masterNr.name} set={v=>setMasterNr(c=>({...c,name:v}))} ph="e.g. Infiniteblock Corp."/></div>
                            <div>
                              <Lbl t="유형 (Bank / Crypto) *"/>
                              <div style={{display:"flex",gap:7,marginBottom:10}}>
                                {["Bank","Crypto"].map(tp=>(
                                  <button key={tp} onClick={()=>setMasterNr(c=>({...c,type:tp,detail:"",network:"",bankName:"",swiftCode:""}))}
                                    style={{flex:1,padding:"7px",borderRadius:7,border:`1.5px solid ${masterNr.type===tp?G.green:G.border}`,background:masterNr.type===tp?G.greenLight:G.white,fontWeight:masterNr.type===tp?700:400,color:masterNr.type===tp?G.greenDark:G.textMid,cursor:"pointer",fontSize:11}}>
                                    {tp==="Bank"?"🏦 Bank":"🔗 Crypto"}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div><Lbl t="사업자등록번호 *"/><Inp v={masterNr.registrationNo} set={v=>setMasterNr(c=>({...c,registrationNo:v}))} ph="e.g. 306-88-02374"/></div>
                            <div><Lbl t="국가 (ISO alpha-2) *"/><Inp v={masterNr.country} set={v=>setMasterNr(c=>({...c,country:v}))} ph="e.g. KR"/></div>
                            <div style={{gridColumn:"1/-1"}}><Lbl t="주소 *"/><Inp v={masterNr.address} set={v=>setMasterNr(c=>({...c,address:v}))} ph="법인 주소 입력"/></div>
                            <div><Lbl t="별칭 (Alias)"/><Inp v={masterNr.alias} set={v=>setMasterNr(c=>({...c,alias:v}))} ph="선택 입력"/></div>
                            <div>
                              <Lbl t="통화 *"/>
                              <select value={masterNr.cur} onChange={e=>setMasterNr(c=>({...c,cur:e.target.value,network:""}))}
                                style={{width:"100%",padding:"8px 11px",borderRadius:7,border:`1px solid ${G.border}`,fontSize:12,marginBottom:10,background:G.white,boxSizing:"border-box"}}>
                                {(masterNr.type==="Bank"?["USD","HKD"]:["USDC","USDT"]).map(c=><option key={c}>{c}</option>)}
                              </select>
                            </div>
                            {masterNr.type==="Crypto"&&(
                              <div style={{gridColumn:"1/-1"}}>
                                <Lbl t="네트워크 *"/>
                                <div style={{display:"flex",gap:7,marginBottom:10}}>
                                  {(NETWORKS[masterNr.cur]||[]).map(n=>{const {bg,text}=NET_COLOR[n];return(
                                    <button key={n} onClick={()=>setMasterNr(c=>({...c,network:n}))}
                                      style={{flex:1,padding:"7px",borderRadius:7,border:`1.5px solid ${masterNr.network===n?text:G.border}`,background:masterNr.network===n?bg:G.white,color:masterNr.network===n?text:G.textMid,fontWeight:masterNr.network===n?700:400,fontSize:12,cursor:"pointer"}}>
                                      {n}
                                    </button>
                                  );})}
                                </div>
                              </div>
                            )}
                            <div style={{gridColumn:"1/-1"}}>
                              <Lbl t={masterNr.type==="Bank"?"계좌번호 *":"지갑주소 *"}/>
                              <Inp v={masterNr.detail} set={v=>setMasterNr(c=>({...c,detail:v}))} ph={masterNr.type==="Bank"?"계좌번호 입력":"지갑주소 입력"}/>
                            </div>
                            {masterNr.type==="Bank"&&(
                              <>
                                <div><Lbl t="은행명 *"/><Inp v={masterNr.bankName} set={v=>setMasterNr(c=>({...c,bankName:v}))} ph="e.g. 한국 거래 은행"/></div>
                                <div><Lbl t="SWIFT 코드 *"/><Inp v={masterNr.swiftCode} set={v=>setMasterNr(c=>({...c,swiftCode:v}))} ph="e.g. HNBNKRSE"/></div>
                              </>
                            )}
                          </div>
                          <div style={{display:"flex",gap:8,marginTop:4}}>
                            <Btn t="다음 → 한도 신청" onClick={()=>{
                              if(!masterNr.name||!masterNr.detail||!masterNr.registrationNo||!masterNr.country||!masterNr.address){T("⚠️ 필수 항목을 입력하세요");return;}
                              if(masterNr.type==="Crypto"&&!masterNr.network){T("⚠️ 네트워크를 선택하세요");return;}
                              if(masterNr.type==="Bank"&&(!masterNr.bankName||!masterNr.swiftCode)){T("⚠️ 은행 정보를 입력하세요");return;}
                              setMasterRecs(rs=>[...rs,{id:rs.length+1,name:masterNr.name,type:masterNr.type,detail:masterNr.detail,cur:masterNr.cur,network:masterNr.network,counterpartyStatus:"PENDING",registrationNo:masterNr.registrationNo,country:masterNr.country,address:masterNr.address,alias:masterNr.alias,bankName:masterNr.bankName,swiftCode:masterNr.swiftCode}]);
                              T("✅ 수취인 등록 완료. Counterparty 상태: PENDING");
                              setMasterRecStep(2);
                            }}/>
                            <button onClick={()=>setShowAddMasterRec(false)} style={{background:"none",border:`1px solid ${G.border}`,borderRadius:6,padding:"10px 16px",fontSize:12,color:G.textMid,cursor:"pointer"}}>취소</button>
                          </div>
                        </>
                      )}

                      {masterRecStep===2&&(()=>{
                        const newRec=masterRecs[masterRecs.length-1];
                        const isTreasury=masterNrQuota.purpose==="TREASURY";
                        return(
                          <>
                            <div style={{background:"#F0FDF4",border:"1px solid #C3E6CB",borderRadius:8,padding:"10px 14px",marginBottom:12,fontSize:11,color:"#276749"}}>
                              ✅ <b>{newRec?.name}</b> 등록 완료 (PENDING). 한도를 신청하세요.
                            </div>
                            {isTreasury&&(
                              <div style={{background:"#EBF4FF",border:"1px solid #BEE3F8",borderRadius:8,padding:"10px 14px",marginBottom:12,fontSize:11,color:"#2B6CB0"}}>
                                💡 본인 계좌 이체(TREASURY)의 경우 내부 자금 이동 근거 문서(이사회 결의서, 내부 이체 승인서 등)를 첨부하세요. OSL 확인 후 계약서/인보이스 대체 가능 여부가 결정됩니다.
                              </div>
                            )}
                            <div>
                              <Lbl t="송금 목적 *"/>
                              <select value={masterNrQuota.purpose} onChange={e=>setMasterNrQuota(c=>({...c,purpose:e.target.value}))}
                                style={{width:"100%",padding:"8px 11px",borderRadius:7,border:`1px solid ${G.border}`,fontSize:12,marginBottom:10,background:G.white,boxSizing:"border-box"}}>
                                <option value="TREASURY">TREASURY — 내부 자금 이동</option>
                                <option value="GOODS_SERVICES">GOODS_SERVICES — 재화/서비스 대금</option>
                                <option value="COMMISSION">COMMISSION — 수수료 정산</option>
                                <option value="OTHERS">OTHERS — 기타</option>
                              </select>
                              <Lbl t="서류 유형 *"/>
                              <div style={{display:"flex",gap:7,marginBottom:10}}>
                                {["Invoice","Contract"].map(dt=>(
                                  <button key={dt} onClick={()=>setMasterNrQuota(c=>({...c,docType:dt}))}
                                    style={{flex:1,padding:"7px",borderRadius:7,border:`1.5px solid ${masterNrQuota.docType===dt?G.green:G.border}`,background:masterNrQuota.docType===dt?G.greenLight:G.white,fontWeight:masterNrQuota.docType===dt?700:400,color:masterNrQuota.docType===dt?G.greenDark:G.textMid,cursor:"pointer",fontSize:11}}>
                                    {dt}
                                  </button>
                                ))}
                              </div>
                              <Lbl t="신청 한도 (USD) *"/><Inp v={masterNrQuota.amount} set={v=>setMasterNrQuota(c=>({...c,amount:v}))} ph="0.01 ~ 999,999,999.99" type="number"/>
                              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                                <div><Lbl t="유효 시작일"/><Inp v={masterNrQuota.validFrom} set={v=>setMasterNrQuota(c=>({...c,validFrom:v}))} ph="yyyy-MM-dd"/></div>
                                <div><Lbl t="유효 종료일"/><Inp v={masterNrQuota.validTo} set={v=>setMasterNrQuota(c=>({...c,validTo:v}))} ph="yyyy-MM-dd"/></div>
                              </div>
                              <Lbl t="서류 업로드 * (PDF/JPG/PNG, max 10MB)"/>
                              <div style={{border:`2px dashed ${G.border}`,borderRadius:8,padding:"16px",textAlign:"center",marginBottom:10,cursor:"pointer",background:G.sidebar}}>
                                <div style={{fontSize:12,color:G.textMid}}>{masterNrQuota.file?`📄 ${masterNrQuota.file}`:"클릭하여 파일 업로드"}</div>
                                <input type="file" accept=".pdf,.jpg,.png" onChange={e=>setMasterNrQuota(c=>({...c,file:e.target.files?.[0]?.name||null}))} style={{display:"none"}} id="master-quota-file"/>
                                <label htmlFor="master-quota-file" style={{fontSize:11,color:G.green,cursor:"pointer",textDecoration:"underline"}}>파일 선택</label>
                              </div>
                            </div>
                            <div style={{display:"flex",gap:8,marginTop:4}}>
                              <Btn t="한도 신청 완료" onClick={()=>{
                                if(!masterNrQuota.amount){T("⚠️ 한도 금액을 입력하세요");return;}
                                if(!masterNrQuota.file){T("⚠️ 서류를 업로드하세요");return;}
                                setMasterQuotas(qs=>[...qs,{id:qs.length+1,recipientId:newRec?.id,recipientName:newRec?.name||"",registrationNo:newRec?.registrationNo||"",docType:masterNrQuota.docType,totalApproved:parseFloat(masterNrQuota.amount)||0,usedAmount:0,frozenAmount:0,status:"PENDING",validFrom:masterNrQuota.validFrom,validTo:masterNrQuota.validTo}]);
                                T("✅ 한도 신청 제출 완료.");
                                setShowAddMasterRec(false);setMasterRecStep(1);
                              }}/>
                              <button onClick={()=>{T("ℹ️ 한도 미설정 — Payout 실행 시 경고가 표시됩니다.");setShowAddMasterRec(false);setMasterRecStep(1);}}
                                style={{background:"none",border:`1px solid ${G.border}`,borderRadius:6,padding:"10px 16px",fontSize:12,color:G.textMid,cursor:"pointer"}}>
                                나중에 신청
                              </button>
                            </div>
                          </>
                        );
                      })()}
                    </Card>
                  )}

                  {/* 수취인 카드 목록 */}
                  {masterRecs.length===0?(
                    <div style={{textAlign:"center",padding:"30px",color:G.textLight,fontSize:12}}>등록된 수취인이 없습니다.</div>
                  ):(
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12}}>
                      {masterRecs.map(r=>{
                        const stC=r.counterpartyStatus==="ACTIVE"?"#276749":r.counterpartyStatus==="PENDING"?"#B45309":"#991B1B";
                        const stBg=r.counterpartyStatus==="ACTIVE"?"#EBF8E1":r.counterpartyStatus==="PENDING"?"#FFFBEB":"#FEE2E2";
                        return(
                          <div key={r.id} style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:10,padding:"14px 16px"}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                              <div>
                                <div style={{fontWeight:700,fontSize:13,color:G.textDark,marginBottom:4}}>{r.name}</div>
                                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                                  <span style={{background:r.type==="Bank"?"#DBEAFE":"#EDE9FE",color:r.type==="Bank"?"#1D4ED8":"#7C3AED",borderRadius:20,padding:"2px 8px",fontWeight:700,fontSize:10}}>{r.type==="Bank"?"🏦 Bank":"🔗 Crypto"}</span>
                                  <span style={{background:stBg,color:stC,borderRadius:20,padding:"2px 8px",fontWeight:700,fontSize:10}}>{r.counterpartyStatus}</span>
                                  {r.network&&<NetBadge net={r.network}/>}
                                </div>
                              </div>
                              <div style={{display:"flex",gap:4}}>
                                <button onClick={()=>{setMasterEditRecId(r.id);setMasterEr({name:r.name,type:r.type,detail:r.detail,cur:r.cur,network:r.network,alias:r.alias||""});}}
                                  style={{fontSize:10,padding:"3px 9px",borderRadius:5,border:`1px solid ${G.border}`,background:G.white,cursor:"pointer",color:G.textMid,fontWeight:600}}>수정</button>
                                <button onClick={()=>setMasterDeleteConfirmId(r.id)}
                                  style={{fontSize:10,padding:"3px 9px",borderRadius:5,border:`1px solid ${G.red}`,background:"#FFF5F5",cursor:"pointer",color:G.red,fontWeight:600}}>삭제</button>
                              </div>
                            </div>
                            <div style={{fontSize:11,color:G.textMid,marginBottom:3}}>
                              {r.type==="Bank"?(
                                <><span style={{color:G.textLight}}>계좌</span> {r.detail} · {r.bankName}</>
                              ):(
                                <><span style={{color:G.textLight}}>주소</span> <span style={{fontFamily:"monospace",fontSize:10}}>{r.detail.length>30?r.detail.slice(0,16)+"..."+r.detail.slice(-8):r.detail}</span></>
                              )}
                            </div>
                            <div style={{display:"flex",gap:6}}>
                              <CIcon c={r.cur} size={14}/>
                              <span style={{fontSize:11,fontWeight:600}}>{r.cur}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 수취인 수정 모달 */}
                  {masterEditRecId&&(()=>{
                    return(
                      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9998}}>
                        <div style={{background:G.white,borderRadius:14,padding:28,maxWidth:400,width:"90%",boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>
                          <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>수취인 정보 수정</div>
                          <Lbl t="법인명"/><Inp v={masterEr.name} set={v=>setMasterEr(c=>({...c,name:v}))} ph="법인명"/>
                          <Lbl t="별칭 (Alias)"/><Inp v={masterEr.alias} set={v=>setMasterEr(c=>({...c,alias:v}))} ph="별칭"/>
                          <Lbl t={masterEr.type==="Bank"?"계좌번호":"지갑주소"}/><Inp v={masterEr.detail} set={v=>setMasterEr(c=>({...c,detail:v}))} ph="정보 입력"/>
                          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8}}>
                            <Btn t="취소" sm color={G.textMid} onClick={()=>setMasterEditRecId(null)}/>
                            <Btn t="저장" sm onClick={()=>{
                              setMasterRecs(rs=>rs.map(x=>x.id===masterEditRecId?{...x,name:masterEr.name,detail:masterEr.detail,alias:masterEr.alias}:x));
                              setMasterEditRecId(null);T("✅ 수취인 정보 수정 완료");
                            }}/>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 수취인 삭제 확인 모달 */}
                  {masterDeleteConfirmId&&(()=>{
                    const target=masterRecs.find(r=>r.id===masterDeleteConfirmId);
                    return(
                      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9998}}>
                        <div style={{background:G.white,borderRadius:14,padding:28,maxWidth:340,width:"90%",boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>
                          <div style={{fontWeight:700,fontSize:14,marginBottom:10}}>수취인 삭제</div>
                          <div style={{fontSize:12,color:G.textMid,marginBottom:6}}>'{target?.name}' 수취인을 삭제하시겠습니까?</div>
                          <div style={{fontSize:11,color:G.red,marginBottom:20}}>이 작업은 되돌릴 수 없습니다.</div>
                          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                            <Btn t="취소" sm color={G.textMid} onClick={()=>setMasterDeleteConfirmId(null)}/>
                            <Btn t="삭제" sm color={G.red} onClick={()=>{
                              setMasterRecs(rs=>rs.filter(r=>r.id!==masterDeleteConfirmId));
                              setMasterDeleteConfirmId(null);T(`🗑 ${target?.name} 삭제`);
                            }}/>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Tab 2 — 한도 관리 */}
              {masterRecTab===1&&(
                <div>
                  {/* 헤더 버튼으로 신규 신청 폼 */}
                  {masterQuotaFormRecId==="new"&&(
                    <div style={{background:G.white,border:`1.5px solid ${G.green}`,borderRadius:10,padding:"16px",marginBottom:16}}>
                      <div style={{fontWeight:700,fontSize:12,color:G.greenDark,marginBottom:12}}>한도 신청 — 수취인 선택</div>
                      <Lbl t="수취인 *"/>
                      <select value={masterQuotaForm.recipientId} onChange={e=>setMasterQuotaForm(c=>({...c,recipientId:e.target.value}))}
                        style={{width:"100%",padding:"8px 11px",borderRadius:7,border:`1px solid ${G.border}`,fontSize:12,marginBottom:10,background:G.white,boxSizing:"border-box"}}>
                        <option value="">— 수취인 선택 —</option>
                        {masterRecs.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                      <div style={{display:"flex",gap:7}}>
                        <Btn t="이동" sm onClick={()=>{
                          if(!masterQuotaForm.recipientId){T("⚠️ 수취인을 선택하세요");return;}
                          setMasterQuotaFormRecId(Number(masterQuotaForm.recipientId));
                          setMasterExpandedQuotaRecId(Number(masterQuotaForm.recipientId));
                          setMasterQuotaForm(c=>({...c,amount:"",validFrom:"",validTo:"",file:null}));
                        }}/>
                        <Btn t="취소" sm color={G.textLight} onClick={()=>setMasterQuotaFormRecId(null)}/>
                      </div>
                    </div>
                  )}

                  {/* 수취인별 요약 카드 */}
                  {(()=>{
                    const recQuotaMap={};
                    masterQuotas.forEach(q=>{
                      if(!recQuotaMap[q.recipientId]) recQuotaMap[q.recipientId]={recipientId:q.recipientId,recipientName:q.recipientName,registrationNo:q.registrationNo,items:[]};
                      recQuotaMap[q.recipientId].items.push(q);
                    });
                    const recGroups=Object.values(recQuotaMap);
                    if(recGroups.length===0) return(
                      <div style={{textAlign:"center",padding:"40px 20px",color:G.textLight,fontSize:12}}>
                        신청된 한도가 없습니다.<br/><span style={{fontSize:11}}>+ 한도 추가 신청 버튼으로 추가하세요.</span>
                      </div>
                    );
                    return recGroups.map(group=>{
                      const totalApproved=group.items.filter(q=>q.status==="ACTIVE").reduce((s,q)=>s+q.totalApproved,0);
                      const usedAmount=group.items.reduce((s,q)=>s+q.usedAmount,0);
                      const frozenAmount=group.items.reduce((s,q)=>s+q.frozenAmount,0);
                      const avail=Math.max(0,totalApproved-usedAmount+frozenAmount);
                      const pct=totalApproved>0?Math.round(avail/totalApproved*100):0;
                      const barColor=pct>=50?G.green:pct>=20?G.orange:G.red;
                      const isExpanded=masterExpandedQuotaRecId===group.recipientId;
                      const isFormOpen=masterQuotaFormRecId===group.recipientId;
                      const isFirstApp=group.items.length===0;
                      const newAmt=parseFloat(masterQuotaForm.amount)||0;
                      return(
                        <div key={group.recipientId} style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:12,marginBottom:12,overflow:"hidden"}}>
                          {/* 카드 헤더 */}
                          <div style={{padding:"16px 18px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}
                            onClick={()=>setMasterExpandedQuotaRecId(isExpanded?null:group.recipientId)}>
                            <div>
                              <div style={{fontWeight:700,fontSize:13,color:G.textDark,marginBottom:3}}>{group.recipientName}</div>
                              <div style={{fontSize:10,color:G.textLight}}>{group.registrationNo} · USD</div>
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <div style={{textAlign:"right"}}>
                                <div style={{fontSize:10,color:G.textLight,marginBottom:1}}>잔여 한도</div>
                                <div style={{fontSize:15,fontWeight:700,color:barColor}}>${avail.toLocaleString()}</div>
                              </div>
                              <span style={{color:G.textLight,fontSize:12}}>{isExpanded?"▲":"▼"}</span>
                            </div>
                          </div>

                          {/* 요약 통계 + 프로그레스 바 */}
                          <div style={{padding:"0 18px 14px",borderBottom:`1px solid ${G.border}`}}>
                            <div style={{height:6,background:"#F3F4F6",borderRadius:4,overflow:"hidden",marginBottom:8}}>
                              <div style={{height:"100%",width:`${pct}%`,background:barColor,borderRadius:4,transition:"width 0.3s"}}/>
                            </div>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,marginBottom:10}}>
                              {[["총 승인 한도",`$${totalApproved.toLocaleString()}`],["사용액",`$${usedAmount.toLocaleString()}`],["처리 중",`$${frozenAmount.toLocaleString()}`],["잔여 한도",`$${avail.toLocaleString()}`]].map(([lbl,val])=>(
                                <div key={lbl}>
                                  <div style={{fontSize:9,color:G.textLight,marginBottom:2}}>{lbl}</div>
                                  <div style={{fontSize:12,fontWeight:700,color:G.textDark}}>{val}</div>
                                </div>
                              ))}
                            </div>
                            <div style={{display:"flex",justifyContent:"flex-end"}}>
                              <button onClick={e=>{e.stopPropagation();setMasterQuotaFormRecId(isFormOpen?null:group.recipientId);if(!isFormOpen)setMasterQuotaForm({docType:"Invoice",purpose:"TREASURY",recipientId:group.recipientId,amount:"",validFrom:"",validTo:"",file:null});}}
                                style={{fontSize:10,padding:"4px 12px",borderRadius:5,border:`1px solid ${G.green}`,background:isFormOpen?G.greenLight:G.white,color:G.greenDark,cursor:"pointer",fontWeight:600}}>
                                {isFormOpen?"접기":"+ 한도 추가 신청"}
                              </button>
                            </div>
                          </div>

                          {/* Accordion: 신청 이력 서브 테이블 */}
                          {isExpanded&&(
                            <div style={{padding:"12px 16px",background:"#FAFBF8"}}>
                              <div style={{fontSize:11,fontWeight:700,color:G.textMid,marginBottom:8}}>신청 이력</div>
                              <div style={{overflowX:"auto"}}>
                                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                                  <thead>
                                    <tr style={{background:G.sidebar}}>
                                      {["신청 번호","서류 유형","신청 한도","승인 한도","사용액","잔여","유효기간","상태","서류"].map(h=>(
                                        <th key={h} style={{padding:"7px 10px",textAlign:"left",fontWeight:700,color:G.textMid,fontSize:10,borderBottom:`1px solid ${G.border}`,whiteSpace:"nowrap"}}>{h}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {group.items.map((q,qi)=>{
                                      const itemAvail=q.status==="PENDING"?null:Math.max(0,q.totalApproved-q.usedAmount+q.frozenAmount);
                                      const stC=q.status==="ACTIVE"?"#276749":q.status==="PENDING"?"#B45309":"#6B7280";
                                      const stBg=q.status==="ACTIVE"?"#EBF8E1":q.status==="PENDING"?"#FFFBEB":"#F3F4F6";
                                      const docLabel=q.purpose==="TREASURY"?"내부 자금 이동 근거":q.docType;
                                      return(
                                        <tr key={q.id} style={{borderBottom:`1px solid ${G.border}`,background:qi%2===0?G.white:"#FAFBF8"}}>
                                          <td style={{padding:"8px 10px",fontWeight:600,color:G.textMid,fontFamily:"monospace"}}>QA-{String(q.id).padStart(3,"0")}</td>
                                          <td style={{padding:"8px 10px"}}><span style={{background:"#EEF2FF",color:"#6366F1",borderRadius:20,padding:"2px 7px",fontSize:10,fontWeight:700}}>{docLabel}</span></td>
                                          <td style={{padding:"8px 10px",color:G.textMid}}>${(q.requestedAmount||q.totalApproved).toLocaleString()}</td>
                                          <td style={{padding:"8px 10px",fontWeight:700}}>{q.status==="PENDING"?<span style={{color:G.orange,fontSize:10}}>심사 중</span>:`$${q.totalApproved.toLocaleString()}`}</td>
                                          <td style={{padding:"8px 10px",color:G.textMid}}>${q.usedAmount.toLocaleString()}</td>
                                          <td style={{padding:"8px 10px",fontWeight:600}}>{itemAvail==null?"—":`$${itemAvail.toLocaleString()}`}</td>
                                          <td style={{padding:"8px 10px",color:G.textLight,fontSize:10,whiteSpace:"nowrap"}}>{q.validFrom&&q.validTo?`${q.validFrom} ~ ${q.validTo}`:"—"}</td>
                                          <td style={{padding:"8px 10px"}}><span style={{background:stBg,color:stC,borderRadius:20,padding:"2px 7px",fontWeight:700,fontSize:10}}>{q.status}</span></td>
                                          <td style={{padding:"8px 10px"}}>
                                            <button onClick={()=>T("📄 서류 미리보기 (Mock)")} style={{fontSize:10,padding:"3px 8px",borderRadius:4,border:`1px solid ${G.border}`,background:G.white,color:G.textMid,cursor:"pointer"}}>📄 보기</button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                  <tfoot>
                                    <tr style={{background:"#F7FBF4",fontWeight:700}}>
                                      <td colSpan={2} style={{padding:"8px 10px",fontSize:11,color:G.textMid}}>합계</td>
                                      <td style={{padding:"8px 10px"}}/>
                                      <td style={{padding:"8px 10px",fontWeight:700}}>${totalApproved.toLocaleString()}</td>
                                      <td style={{padding:"8px 10px",fontWeight:700}}>${usedAmount.toLocaleString()}</td>
                                      <td style={{padding:"8px 10px",fontWeight:700,color:barColor}}>${avail.toLocaleString()}</td>
                                      <td colSpan={3}/>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Accordion: 한도 신청 폼 */}
                          {isFormOpen&&(
                            <div style={{padding:"14px 16px",background:G.greenLight,borderTop:`1px solid ${G.border}`}} onClick={e=>e.stopPropagation()}>
                              {isFirstApp?(
                                <div style={{background:"#EBF4FF",border:"1px solid #BEE3F8",borderRadius:7,padding:"8px 12px",marginBottom:12,fontSize:11,color:"#2B6CB0"}}>
                                  📋 이 수취인에 대한 첫 번째 한도 신청입니다.
                                </div>
                              ):(
                                <div style={{background:G.greenLight,border:`1px solid ${G.border}`,borderRadius:7,padding:"8px 12px",marginBottom:12,fontSize:11,color:G.greenDark}}>
                                  ➕ 기존 한도에 추가 승인됩니다. 승인 시 총 승인 한도가 증가합니다.
                                </div>
                              )}
                              {!isFirstApp&&(
                                <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:7,padding:"10px 14px",marginBottom:12}}>
                                  {[["현재 총 승인 한도",`$${totalApproved.toLocaleString()} USD`],["잔여 한도",`$${avail.toLocaleString()} USD`],["이번 신청 후 예상 총 한도",`$${(totalApproved+newAmt).toLocaleString()} USD`]].map(([k,v],ki)=>(
                                    <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:ki<2?4:0}}>
                                      <span style={{fontSize:11,color:G.textMid}}>{k}</span>
                                      <span style={{fontSize:11,fontWeight:ki===2?700:600,color:ki===2?G.greenDark:G.textDark}}>{v}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <Lbl t="서류 유형 *"/>
                              <div style={{display:"flex",gap:7,marginBottom:10}}>
                                {["Invoice","Contract"].map(dt=>(
                                  <button key={dt} onClick={()=>setMasterQuotaForm(c=>({...c,docType:dt}))}
                                    style={{flex:1,padding:"7px",borderRadius:7,border:`1.5px solid ${masterQuotaForm.docType===dt?G.green:G.border}`,background:masterQuotaForm.docType===dt?G.greenLight:G.white,fontWeight:masterQuotaForm.docType===dt?700:400,cursor:"pointer",color:masterQuotaForm.docType===dt?G.greenDark:G.textMid,fontSize:12}}>
                                    {dt}
                                  </button>
                                ))}
                              </div>
                              <Lbl t="신청 한도 (USD) *"/>
                              <Inp v={masterQuotaForm.amount} set={v=>setMasterQuotaForm(c=>({...c,amount:v}))} ph="0.01 ~ 999,999,999.99"/>
                              <div style={{display:"flex",gap:8}}>
                                <div style={{flex:1}}><Lbl t="유효 시작일"/><Inp v={masterQuotaForm.validFrom} set={v=>setMasterQuotaForm(c=>({...c,validFrom:v}))} ph="yyyy-MM-dd"/></div>
                                <div style={{flex:1}}><Lbl t="유효 종료일"/><Inp v={masterQuotaForm.validTo} set={v=>setMasterQuotaForm(c=>({...c,validTo:v}))} ph="yyyy-MM-dd"/></div>
                              </div>
                              <Lbl t="서류 업로드 (PDF/JPG/PNG, max 10MB) *"/>
                              <div style={{border:`1.5px dashed ${G.border}`,borderRadius:7,padding:"14px",textAlign:"center",marginBottom:12,background:G.white,fontSize:11,color:G.textMid,cursor:"pointer"}}
                                onClick={()=>document.getElementById(`qf-master-${group.recipientId}`).click()}>
                                {masterQuotaForm.file?`📎 ${masterQuotaForm.file}`:"파일 선택 또는 드래그 앤 드롭"}
                                <input id={`qf-master-${group.recipientId}`} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{display:"none"}}
                                  onChange={e=>{if(e.target.files[0])setMasterQuotaForm(c=>({...c,file:e.target.files[0].name}));}}/>
                              </div>
                              <div style={{display:"flex",gap:7}}>
                                <Btn t="신청 완료" sm onClick={()=>{
                                  if(!masterQuotaForm.amount){T("⚠️ 한도 금액을 입력하세요");return;}
                                  if(!masterQuotaForm.file){T("⚠️ 서류를 업로드하세요");return;}
                                  const nAmt=parseFloat(masterQuotaForm.amount)||0;
                                  setMasterQuotas(qs=>[...qs,{id:Date.now(),recipientId:group.recipientId,recipientName:group.recipientName,registrationNo:group.registrationNo,docType:masterQuotaForm.docType,purpose:masterQuotaForm.purpose||"TREASURY",requestedAmount:nAmt,totalApproved:nAmt,usedAmount:0,frozenAmount:0,status:"PENDING",validFrom:masterQuotaForm.validFrom,validTo:masterQuotaForm.validTo}]);
                                  setMasterQuotaFormRecId(null);
                                  T("✅ 한도 신청이 제출되었습니다. 승인 후 총 한도에 합산됩니다.");
                                }}/>
                                <Btn t="취소" sm color={G.textLight} onClick={()=>setMasterQuotaFormRecId(null)}/>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>
          )}

          {menu==="Clients"&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontWeight:700,fontSize:13}}>Sub Accounts ({clients.length})</div>
                <Btn t="+ New Client" sm onClick={()=>setShowCreate(v=>!v)}/>
              </div>
              {showCreate&&(
                <Card style={{marginBottom:14,border:`1.5px solid ${G.green}`}}>
                  <div style={{fontWeight:700,fontSize:12,marginBottom:12,color:G.greenDark}}>New Client — 1단계: 계정 생성 (KYB 전)</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
                    <div style={{gridColumn:"1/-1"}}><Lbl t="Company Name *"/><Inp v={nc.name} set={v=>setNc(c=>({...c,name:v}))} ph="e.g. GlobalPay"/></div>
                    <div>
                      <Lbl t="On-ramp Markup (%)"/>
                      <input type="number" value={(nc.muOn*100).toFixed(2)} onChange={e=>setNc(c=>({...c,muOn:parseFloat(e.target.value)/100}))} step="0.01"
                        style={{width:"100%",padding:"8px 11px",borderRadius:7,border:`1px solid ${G.border}`,fontSize:12,boxSizing:"border-box",marginBottom:10}}/>
                    </div>
                    <div>
                      <Lbl t="Off-ramp Markup (%)"/>
                      <input type="number" value={(nc.muOff*100).toFixed(2)} onChange={e=>setNc(c=>({...c,muOff:parseFloat(e.target.value)/100}))} step="0.01"
                        style={{width:"100%",padding:"8px 11px",borderRadius:7,border:`1px solid ${G.border}`,fontSize:12,boxSizing:"border-box",marginBottom:10}}/>
                    </div>
                  </div>
                  <div style={{background:"#EBF4FF",border:"1px solid #BEE3F8",borderRadius:7,padding:"9px 12px",fontSize:10,color:"#2B6CB0",marginBottom:10}}>
                    📋 계정 생성 후 KYB를 진행하세요. KYB 승인 완료 후 이메일 초대가 발송됩니다.
                  </div>
                  <Btn t="계정 생성" sm onClick={()=>{
                    if(!nc.name){T("⚠️ Company Name 입력");return;}
                    setClients(cs=>[...cs,{id:"SUB-00"+(cs.length+1),name:nc.name,email:"",st:"Active",created:new Date().toISOString().split("T")[0],mu:nc.muOn,muOn:nc.muOn,muOff:nc.muOff,otpReq:false,locked:false,kybStatus:"INACTIVE"}]);
                    setNc({name:"",muOn:0.10,muOff:0.10});setShowCreate(false);
                    T(`✅ "${nc.name}" 계정 생성 완료. KYB 등록 후 이메일 초대를 발송하세요.`);
                  }}/>
                </Card>
              )}
              <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:10,overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead>
                    <tr style={{background:G.sidebar}}>
                      {["ID","Company","Email","Status","KYB","Created","On-ramp Markup","Off-ramp Markup","Actions"].map(h=>(
                        <th key={h} style={{padding:"9px 11px",textAlign:"left",fontWeight:700,color:G.textMid,borderBottom:`1px solid ${G.border}`,whiteSpace:"nowrap"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((c,i)=>(
                      <tr key={c.id} style={{background:i%2===0?G.white:"#FAFBF8",verticalAlign:"middle"}}>
                        <td style={{padding:"10px 11px",fontWeight:600,color:G.textLight,fontSize:10,whiteSpace:"nowrap"}}>{c.id}</td>
                        <td style={{padding:"10px 11px",fontWeight:700,whiteSpace:"nowrap"}}>
                          {c.name}
                          {c.locked&&<span style={{marginLeft:5,fontSize:9,color:G.red}}>🔒</span>}
                          {c.otpReq&&<span style={{marginLeft:4,fontSize:9,color:G.orange}}>●OTP</span>}
                        </td>
                        <td style={{padding:"10px 11px",color:G.textMid,fontSize:10}}>{c.email}</td>
                        <td style={{padding:"10px 11px"}}><Badge t={c.st} color={stColor(c.st)}/></td>
                        <td style={{padding:"10px 11px"}}><KYBBadge status={c.kybStatus}/></td>
                        <td style={{padding:"10px 11px",color:G.textLight,whiteSpace:"nowrap"}}>{c.created}</td>
                        <td style={{padding:"10px 11px"}}>
                          {editFee?.id===c.id&&editFee?.dir==='on'?(
                            <div style={{display:"flex",alignItems:"center",gap:4}}>
                              <input type="number" defaultValue={(c.muOn*100).toFixed(2)} id={`muOn-${c.id}`} step="0.01"
                                style={{width:58,padding:"4px 6px",borderRadius:6,border:`1.5px solid ${G.green}`,fontSize:11,outline:"none",textAlign:"right"}}/>
                              <span style={{fontSize:10,color:G.textMid}}>%</span>
                              <Btn t="저장" sm color={G.green} onClick={()=>{
                                const val=parseFloat(document.getElementById(`muOn-${c.id}`).value)/100;
                                setClients(cs=>cs.map(x=>x.id===c.id?{...x,muOn:val,mu:val}:x));setEditFee(null);T(`✅ ${c.name} On-ramp markup updated`);
                              }}/>
                              <Btn t="취소" sm color={G.textLight} onClick={()=>setEditFee(null)}/>
                            </div>
                          ):(
                            <div style={{display:"flex",alignItems:"center",gap:6}}>
                              <span style={{background:G.greenLight,color:G.greenDark,borderRadius:6,padding:"3px 10px",fontWeight:700,fontSize:11,cursor:"default"}}
                                title={`OSL Base 0% + IB Markup = 고객사 최종 On-ramp 수수료`}>
                                +{(c.muOn*100).toFixed(2)}%
                              </span>
                              <button onClick={()=>setEditFee({id:c.id,dir:'on'})} style={{fontSize:10,padding:"3px 9px",borderRadius:5,border:`1px solid ${G.border}`,background:G.white,cursor:"pointer",color:G.textMid,fontWeight:600}}>수정</button>
                            </div>
                          )}
                        </td>
                        <td style={{padding:"10px 11px"}}>
                          {editFee?.id===c.id&&editFee?.dir==='off'?(
                            <div style={{display:"flex",alignItems:"center",gap:4}}>
                              <input type="number" defaultValue={(c.muOff*100).toFixed(2)} id={`muOff-${c.id}`} step="0.01"
                                style={{width:58,padding:"4px 6px",borderRadius:6,border:`1.5px solid ${G.green}`,fontSize:11,outline:"none",textAlign:"right"}}/>
                              <span style={{fontSize:10,color:G.textMid}}>%</span>
                              <Btn t="저장" sm color={G.green} onClick={()=>{
                                const val=parseFloat(document.getElementById(`muOff-${c.id}`).value)/100;
                                setClients(cs=>cs.map(x=>x.id===c.id?{...x,muOff:val}:x));setEditFee(null);T(`✅ ${c.name} Off-ramp markup updated`);
                              }}/>
                              <Btn t="취소" sm color={G.textLight} onClick={()=>setEditFee(null)}/>
                            </div>
                          ):(
                            <div style={{display:"flex",alignItems:"center",gap:6}}>
                              <span style={{background:"#DBEAFE",color:"#1D4ED8",borderRadius:6,padding:"3px 10px",fontWeight:700,fontSize:11,cursor:"default"}}
                                title={`OSL Base 0.2% + IB Markup = 고객사 최종 Off-ramp 수수료`}>
                                +{(c.muOff*100).toFixed(2)}%
                              </span>
                              <button onClick={()=>setEditFee({id:c.id,dir:'off'})} style={{fontSize:10,padding:"3px 9px",borderRadius:5,border:`1px solid ${G.border}`,background:G.white,cursor:"pointer",color:G.textMid,fontWeight:600}}>수정</button>
                            </div>
                          )}
                        </td>
                        <td style={{padding:"10px 11px"}}>
                          <div style={{display:"flex",gap:4,flexWrap:"wrap",minWidth:180}}>
                            {/* KYB 등록 (INACTIVE만) */}
                            {c.kybStatus==="INACTIVE"&&(
                              <button onClick={()=>{setKybTargetId(c.id);setKybSection(1);setKybErrors([]);setKybSumsubWarn(false);setMenu("Sub KYB");}}
                                style={{fontSize:9,padding:"3px 7px",borderRadius:3,border:"1px solid #7C3AED",background:"#F3E8FF",color:"#7C3AED",cursor:"pointer",fontWeight:600,whiteSpace:"nowrap"}}>KYB 등록</button>
                            )}
                            {/* KYB 재제출 (REJECTED만) — 기존 데이터 pre-fill */}
                            {c.kybStatus==="REJECTED"&&(
                              <button onClick={()=>{
                                setKybTargetId(c.id);setKybSection(1);setKybErrors([]);setKybSumsubWarn(false);
                                if(c.kybData) setKybForm(f=>({...f,...c.kybData}));
                                setMenu("Sub KYB");
                              }} style={{fontSize:9,padding:"3px 7px",borderRadius:3,border:"1px solid #991B1B",background:"#FEE2E2",color:"#991B1B",cursor:"pointer",fontWeight:600,whiteSpace:"nowrap"}}>KYB 재제출</button>
                            )}
                            {/* OTP 재발송 */}
                            {c.otpReq&&(
                              <button onClick={()=>{setClients(cs=>cs.map(x=>x.id===c.id?{...x,otpReq:false}:x));T(`📧 ${c.name} OTP 재발송 완료`);}}
                                style={{fontSize:9,padding:"3px 7px",borderRadius:3,border:"1px solid #6366F1",background:"#EEF2FF",color:"#6366F1",cursor:"pointer",fontWeight:600,whiteSpace:"nowrap"}}>OTP 재발송</button>
                            )}
                            {/* 이메일 초대 / 재발송 (KYB ACTIVE인 경우) */}
                            {c.kybStatus==="ACTIVE"&&!c.email&&inviteClientId!==c.id&&(
                              <button onClick={()=>{setInviteClientId(c.id);setInviteEmail("");}}
                                style={{fontSize:9,padding:"3px 7px",borderRadius:3,border:"1px solid #0EA5E9",background:"#F0F9FF",color:"#0EA5E9",cursor:"pointer",fontWeight:600,whiteSpace:"nowrap"}}>이메일 초대</button>
                            )}
                            {c.kybStatus==="ACTIVE"&&inviteClientId===c.id&&(
                              <div style={{display:"flex",gap:3,alignItems:"center",flexWrap:"nowrap"}}>
                                <input value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} placeholder="admin@company.com"
                                  style={{width:130,padding:"3px 6px",borderRadius:4,border:`1.5px solid #0EA5E9`,fontSize:10,outline:"none"}}/>
                                <button onClick={()=>{
                                  if(!inviteEmail){T("⚠️ 이메일 입력");return;}
                                  setClients(cs=>cs.map(x=>x.id===c.id?{...x,email:inviteEmail}:x));
                                  setInviteClientId(null);setInviteEmail("");
                                  T(`✅ ${inviteEmail}로 초대 이메일이 발송되었습니다.`);
                                }} style={{fontSize:9,padding:"3px 7px",borderRadius:3,border:"1px solid #0EA5E9",background:"#0EA5E9",color:"#fff",cursor:"pointer",fontWeight:600,whiteSpace:"nowrap"}}>초대 발송</button>
                                <button onClick={()=>{setInviteClientId(null);setInviteEmail("");}} style={{fontSize:9,padding:"3px 7px",borderRadius:3,border:`1px solid ${G.border}`,background:G.white,color:G.textMid,cursor:"pointer",fontWeight:600}}>취소</button>
                              </div>
                            )}
                            {c.kybStatus==="ACTIVE"&&c.email&&(
                              <button onClick={()=>{T(`📧 ${c.email}로 재발송 완료`);}}
                                style={{fontSize:9,padding:"3px 7px",borderRadius:3,border:"1px solid #0EA5E9",background:"#EFF6FF",color:"#0EA5E9",cursor:"pointer",fontWeight:600,whiteSpace:"nowrap"}}>재발송</button>
                            )}
                            {/* 잠금 해제 */}
                            {c.locked&&(
                              <button onClick={()=>{setClients(cs=>cs.map(x=>x.id===c.id?{...x,locked:false}:x));T(`🔓 ${c.name} 잠금 해제`);}}
                                style={{fontSize:9,padding:"3px 7px",borderRadius:3,border:"1px solid #0EA5E9",background:"#F0F9FF",color:"#0EA5E9",cursor:"pointer",fontWeight:600,whiteSpace:"nowrap"}}>잠금 해제</button>
                            )}
                            {/* 정지 / 활성화 */}
                            {c.st==="Active"&&(
                              <button onClick={()=>{setClients(cs=>cs.map(x=>x.id===c.id?{...x,st:"Suspended"}:x));T(`⏸ ${c.name} 정지`);}}
                                style={{fontSize:9,padding:"3px 7px",borderRadius:3,border:`1px solid ${G.orange}`,background:"#FFF8EE",color:G.orange,cursor:"pointer",fontWeight:600,whiteSpace:"nowrap"}}>정지</button>
                            )}
                            {c.st==="Suspended"&&(
                              <button onClick={()=>{setClients(cs=>cs.map(x=>x.id===c.id?{...x,st:"Active"}:x));T(`▶ ${c.name} 활성화`);}}
                                style={{fontSize:9,padding:"3px 7px",borderRadius:3,border:`1px solid ${G.green}`,background:G.greenLight,color:G.greenDark,cursor:"pointer",fontWeight:600,whiteSpace:"nowrap"}}>활성화</button>
                            )}
                            {/* 삭제 */}
                            <button onClick={()=>setClientDeleteId(c.id)}
                              style={{fontSize:9,padding:"3px 7px",borderRadius:3,border:`1px solid ${G.red}`,background:"#FFF5F5",color:G.red,cursor:"pointer",fontWeight:600,whiteSpace:"nowrap"}}>삭제</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 삭제 확인 모달 */}
              {clientDeleteId&&(()=>{
                const target=clients.find(c=>c.id===clientDeleteId);
                return(
                  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9998}}>
                    <div style={{background:G.white,borderRadius:14,padding:28,maxWidth:340,width:"90%",boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>
                      <div style={{fontWeight:700,fontSize:14,marginBottom:10}}>고객사 삭제</div>
                      <div style={{fontSize:12,color:G.textMid,marginBottom:6}}>'{target?.name}' 계정을 삭제하시겠습니까?</div>
                      <div style={{fontSize:11,color:G.red,marginBottom:20}}>이 작업은 되돌릴 수 없습니다.</div>
                      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                        <Btn t="취소" sm color={G.textMid} onClick={()=>setClientDeleteId(null)}/>
                        <Btn t="삭제" sm color={G.red} onClick={()=>{
                          setClients(cs=>cs.filter(x=>x.id!==clientDeleteId));
                          setClientDeleteId(null);
                          T(`🗑 ${target?.name} 삭제`);
                        }}/>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {menu==="All Transfers"&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{display:"flex",gap:5}}>{["All","Completed","Pending"].map(f=><button key={f} onClick={()=>setTrF(f)} style={{padding:"4px 10px",borderRadius:20,border:`1px solid ${trF===f?G.green:G.border}`,background:trF===f?G.greenLight:G.white,color:trF===f?G.greenDark:G.textMid,fontWeight:trF===f?700:400,cursor:"pointer",fontSize:11}}>{f}</button>)}</div>
                <Btn t="📥 Export" sm onClick={()=>exportCSV(allTr,[{l:"TR ID",k:"id"},{l:"Date",k:"date"},{l:"From",k:"from"},{l:"To",k:"to"},{l:"Amount",k:"amt"},{l:"Currency",k:"cur"},{l:"Network",k:"network"},{l:"Note",k:"note"},{l:"Status",k:"st"}],"all_transfers.csv")}/>
              </div>
              <TrTable rows={allTr}/>
            </div>
          )}

          {menu==="All Orders"&&(
            <div>
              <div style={{display:"flex",justifyContent:"flex-end",marginBottom:10}}>
                <Btn t="📥 Export" sm onClick={()=>{
                  const rows=TX_DATA.map(r=>{
                    let feeUsd="";
                    if(r.fxFee&&r.fxFee.includes("총")){const m=r.fxFee.match(/총 ([\d.]+)/);if(m)feeUsd=m[1]+" USD";}
                    else if(r.type==="Payout"&&(r.network==="SWIFT"||r.network==="Local Bank"))feeUsd="35.00 USD";
                    return {...r,feeUsd};
                  });
                  exportCSV(rows,[{l:"TX ID",k:"id"},{l:"Date",k:"date"},{l:"Account",k:"acct"},{l:"Type",k:"type"},{l:"Recipient",k:"recipientName"},{l:"From Cur",k:"fromCur"},{l:"From Amt",k:"fromAmt"},{l:"To Cur",k:"cur"},{l:"To Amt",k:"amt"},{l:"Network",k:"network"},{l:"Fee (USD)",k:"feeUsd"},{l:"Status",k:"st"}],"all_orders.csv");
                }}/>
              </div>
              <TxTable rows={TX_DATA} showAcct={true} onSelect={setSelectedTx}/>
            </div>
          )}

          {menu==="Sub KYB"&&(()=>{
            const KYB_ENT_TYPES=["주식회사","유한회사","합명회사","합자회사","기타"];
            const KYB_INDUSTRIES=["핀테크/송금","무역/수출입","제조업","서비스업","금융업","기타"];
            const KYB_FUNDS=["영업 수익","투자 유치","대출","자기 자본","기타"];
            const KYB_PURPOSE=["해외 송금","결제 서비스","환전","투자","기타"];
            const KYB_FREQ=["월 1~5회","월 6~20회","월 21~50회","월 50회 이상"];
            const KYB_AMT=["$0 ~ $10,000","$10,001 ~ $50,000","$50,001 ~ $200,000","$200,001 이상"];
            const DOC_LIST=[
              {key:"incorporation",  label:"Certificate of Incorporation (법인설립증명서)"},
              {key:"businessReg",    label:"Business Registration (사업자등록증)"},
              {key:"bylaws",         label:"M&A / Bylaws / Constitution (정관)"},
              {key:"companyExtract", label:"Official Company Extract (등기 초본)"},
              {key:"orgChart",       label:"Functional Org Chart (조직도)"},
              {key:"shareholding",   label:"Shareholding Structure Chart (지분구조도)"},
              {key:"license",        label:"Proof of License (라이선스 증명)"},
              {key:"bankStatement",  label:"Bank Statement — 3 months (자금출처)"},
            ];
            const PERSON_ROLES=["UBO","Director","Authorized Signatory"];
            const target=clients.find(c=>c.id===kybTargetId);
            if(!target) return(
              <div style={{padding:20,textAlign:"center",color:G.textMid}}>
                <div style={{marginBottom:12,fontSize:13}}>대상 고객사를 선택하세요.</div>
                <Btn t="← Clients 목록으로" sm onClick={()=>setMenu("Clients")}/>
              </div>
            );
            const isRejected=target.kybStatus==="REJECTED";
            // validation checks
            const f=kybForm;
            const sec1Done=f.enterpriseName&&f.enterpriseNameEn&&f.registrationNumber&&f.enterpriseType&&f.establishmentDate&&f.officeCountry&&f.officialAddress&&f.registrationAddress&&f.registrationCity&&f.industry&&f.fundsSource&&f.accountPurpose&&f.tradingFrequency&&f.transactionAmount;
            const sec2Done=Object.values(kybDocs).every(v=>v!==null);
            const sec3Done=kybPersons.length>0;
            const sec4Done=kybNoCompany||kybCompanies.length>0;
            const sec5Done=f.email&&f.ip&&f.deviceId;
            const secDone=[null,sec1Done,sec2Done,sec3Done,sec4Done,sec5Done];
            const handleFileUpload=(key,file)=>{
              if(!file)return;
              if(file.size>15*1024*1024){T("⚠️ 파일 크기는 15MB를 초과할 수 없습니다.");return;}
              setKybDocs(d=>({...d,[key]:{name:file.name,size:(file.size/1024/1024).toFixed(1)+"MB"}}));
            };
            const handleSubmitKyb=(forceContinue=false)=>{
              const errs=[];
              if(!sec1Done) errs.push("Section 1: 모든 필수 필드를 입력하세요");
              if(!sec2Done) errs.push("Section 2: 모든 필수 서류를 업로드하세요");
              if(!sec3Done) errs.push("Section 3: 관련 인물을 최소 1명 등록하세요");
              if(!sec4Done) errs.push("Section 4: 관련 법인 정보를 완성하세요");
              if(!sec5Done) errs.push("Section 5: 제출 정보를 입력하세요");
              if(errs.length>0){setKybErrors(errs);return;}
              const sumsubPending=kybPersons.some(p=>p.sumsubStatus!=="verified");
              if(sumsubPending&&!forceContinue){setKybSumsubWarn(true);return;}
              setKybErrors([]);setKybSumsubWarn(false);
              setClients(cs=>cs.map(x=>x.id===kybTargetId?{...x,kybStatus:"PROCESSING"}:x));
              T("✅ KYB 제출 완료. 심사 결과는 영업일 기준 수일 내 안내됩니다.");
              setMenu("Clients");
            };
            const SECTIONS=[
              {id:1,label:"기업 기본 정보 (Enterprise Info)"},
              {id:2,label:"서류 업로드 (KYB Documents)"},
              {id:3,label:"관련 인물 (Related Persons)"},
              {id:4,label:"관련 법인 (Related Companies)"},
              {id:5,label:"제출 정보 (Submission Info)"},
            ];
            return(
              <div style={{maxWidth:720}}>
                {/* 헤더 */}
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                  <button onClick={()=>setMenu("Clients")} style={{background:"none",border:"none",cursor:"pointer",color:G.textMid,fontSize:12,fontWeight:600}}>← 목록</button>
                  <div style={{fontWeight:700,fontSize:15}}>{target.name} — KYB {isRejected?"재제출":target.kybStatus==="PROCESSING"?"심사 현황":"등록"}</div>
                  <KYBBadge status={target.kybStatus}/>
                </div>

                {/* PROCESSING 배너 */}
                {target.kybStatus==="PROCESSING"&&(
                  <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:9,padding:"12px 16px",marginBottom:16}}>
                    <div style={{fontWeight:700,color:"#B45309",fontSize:12,marginBottom:4}}>KYB 심사 진행 중</div>
                    <div style={{fontSize:11,color:"#92400E"}}>제출된 서류를 검토 중입니다. 영업일 기준 수일 내 결과를 안내드립니다. 심사 중에는 내용 수정 및 재제출이 불가합니다.</div>
                  </div>
                )}

                {/* REJECTED 사유 배너 */}
                {isRejected&&(
                  <div style={{background:"#FEE2E2",border:"1px solid #FECACA",borderRadius:9,padding:"12px 16px",marginBottom:16}}>
                    <div style={{fontWeight:700,color:"#991B1B",fontSize:12,marginBottom:4}}>KYB 거절 사유</div>
                    <div style={{fontSize:11,color:"#991B1B"}}>서류 불충분 또는 정보 불일치. 모든 서류를 재확인 후 재제출하세요.</div>
                  </div>
                )}

                {/* 에러 요약 배너 */}
                {kybErrors.length>0&&(
                  <div style={{background:"#FFF7ED",border:`1px solid ${G.orange}`,borderRadius:9,padding:"12px 16px",marginBottom:16}}>
                    <div style={{fontWeight:700,color:G.orange,fontSize:12,marginBottom:6}}>⚠️ 제출 전 확인 필요 항목</div>
                    {kybErrors.map((e,i)=><div key={i} style={{fontSize:11,color:"#92400E",marginBottom:2}}>• {e}</div>)}
                  </div>
                )}

                {/* 섹션 아코디언 */}
                {SECTIONS.map(sec=>{
                  const isOpen=kybSection===sec.id;
                  const hasErr=kybErrors.some(e=>e.startsWith(`Section ${sec.id}`));
                  return(
                    <div key={sec.id} style={{border:`1.5px solid ${hasErr?G.orange:isOpen?G.green:G.border}`,borderRadius:10,marginBottom:10,overflow:"hidden",transition:"border 0.15s"}}>
                      {/* 섹션 헤더 */}
                      <div onClick={()=>setKybSection(isOpen?0:sec.id)}
                        style={{padding:"12px 16px",cursor:"pointer",background:isOpen?G.greenLight:G.sidebar,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div style={{fontWeight:700,fontSize:12,color:isOpen?G.greenDark:G.textDark,display:"flex",alignItems:"center",gap:8}}>
                          <span style={{width:20,height:20,borderRadius:"50%",background:secDone[sec.id]?G.green:hasErr?G.orange:G.border,color:secDone[sec.id]||hasErr?"#fff":G.textMid,fontSize:10,fontWeight:700,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{sec.id}</span>
                          {sec.label}
                          {secDone[sec.id]&&<span style={{fontSize:10,color:G.green,fontWeight:600}}>✓</span>}
                        </div>
                        <span style={{color:G.textMid,fontSize:12}}>{isOpen?"▲":"▼"}</span>
                      </div>

                      {/* 섹션 콘텐츠 */}
                      {isOpen&&(
                        <div style={{padding:"16px 18px"}}>

                          {/* ── Section 1: Enterprise Info ── */}
                          {sec.id===1&&(
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
                              {[
                                {k:"enterpriseName",    l:"법인명 (한국어)*",       ph:"예: 핸패스 주식회사"},
                                {k:"enterpriseNameEn",  l:"법인명 (영문)*",         ph:"e.g. Hanpass Corp."},
                                {k:"registrationNumber",l:"사업자등록번호*",         ph:"예: 110-81-55000"},
                                {k:"officeCountry",     l:"법인 국가 (ISO alpha-2)*",ph:"예: KR"},
                                {k:"officialAddress",   l:"공식 주소*",             ph:"법인 공식 주소"},
                                {k:"registrationAddress",l:"등록 주소*",            ph:"등기 주소"},
                                {k:"registrationCity",  l:"등록 도시*",             ph:"예: Seoul"},
                                {k:"establishmentDate", l:"설립일 (yyyy-MM-dd)*",   ph:"2020-01-01"},
                              ].map(({k,l,ph})=>(
                                <div key={k}>
                                  <Lbl t={l}/>
                                  <Inp v={kybForm[k]} set={v=>setKybForm(fm=>({...fm,[k]:v}))} ph={ph}/>
                                </div>
                              ))}
                              {[
                                {k:"enterpriseType",   l:"기업 유형*",     opts:KYB_ENT_TYPES},
                                {k:"industry",         l:"업종*",          opts:KYB_INDUSTRIES},
                                {k:"fundsSource",      l:"자금 출처*",     opts:KYB_FUNDS},
                                {k:"accountPurpose",   l:"계정 목적*",     opts:KYB_PURPOSE},
                                {k:"tradingFrequency", l:"거래 빈도*",     opts:KYB_FREQ},
                                {k:"transactionAmount",l:"거래 금액 범위*",opts:KYB_AMT},
                              ].map(({k,l,opts})=>(
                                <div key={k}>
                                  <Lbl t={l}/>
                                  <Sel v={kybForm[k]} set={v=>setKybForm(fm=>({...fm,[k]:v}))} opts={opts}/>
                                </div>
                              ))}
                              <div style={{gridColumn:"1/-1"}}>
                                <Lbl t="Bearer Share*"/>
                                <div style={{display:"flex",gap:10,marginBottom:10}}>
                                  {["Y","N"].map(v=>(
                                    <label key={v} style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:12}}>
                                      <input type="radio" name="bearerShare" value={v} checked={kybForm.bearerShare===v} onChange={()=>setKybForm(fm=>({...fm,bearerShare:v}))} style={{accentColor:G.green}}/>
                                      {v==="Y"?"Yes (있음)":"No (없음)"}
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ── Section 2: KYB Documents ── */}
                          {sec.id===2&&(
                            <div style={{display:"flex",flexDirection:"column",gap:10}}>
                              <div style={{fontSize:11,color:G.textMid,marginBottom:4}}>지원 형식: PDF, JPG, JPEG, PNG · 파일당 최대 15MB</div>
                              {DOC_LIST.map(doc=>(
                                <div key={doc.key}>
                                  <div style={{fontSize:11,fontWeight:600,marginBottom:5}}>{doc.label} <span style={{color:G.red}}>*</span></div>
                                  {kybDocs[doc.key]?(
                                    <div style={{display:"flex",alignItems:"center",gap:8,background:G.greenLight,border:`1px solid ${G.border}`,borderRadius:7,padding:"9px 12px"}}>
                                      <span>📎</span>
                                      <span style={{flex:1,fontSize:11,fontWeight:600,color:G.textDark}}>{kybDocs[doc.key].name}</span>
                                      <span style={{fontSize:10,color:G.textLight}}>{kybDocs[doc.key].size}</span>
                                      <button onClick={()=>setKybDocs(d=>({...d,[doc.key]:null}))}
                                        style={{fontSize:10,padding:"2px 7px",borderRadius:4,border:`1px solid ${G.red}`,background:"#FFF5F5",color:G.red,cursor:"pointer",fontWeight:600}}>삭제</button>
                                    </div>
                                  ):(
                                    <div style={{border:`1.5px dashed ${G.border}`,borderRadius:7,padding:"14px",textAlign:"center",cursor:"pointer",background:"#FAFAFA",fontSize:11,color:G.textMid}}
                                      onClick={()=>document.getElementById(`kd-${doc.key}`).click()}>
                                      📁 파일 선택 또는 드래그앤드롭
                                      <input id={`kd-${doc.key}`} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{display:"none"}}
                                        onChange={e=>{if(e.target.files[0])handleFileUpload(doc.key,e.target.files[0]);e.target.value="";}}/>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* ── Section 3: Related Persons ── */}
                          {sec.id===3&&(
                            <div>
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                                <div style={{fontSize:11,color:G.textMid}}>UBO, 이사(Director), 공인 서명자(Authorized Signatory) 각각 등록. 최소 1명 필수.</div>
                                <Btn t="+ 인물 추가" sm onClick={()=>setKybPersons(ps=>[...ps,{id:Date.now(),roles:[],name:"",nationality:"KR",birthDate:"",residenceCountry:"KR",docFile:null,addressFile:null,sumsubStatus:"pending"}])}/>
                              </div>
                              {kybPersons.length===0&&(
                                <div style={{textAlign:"center",padding:"24px",color:G.textLight,fontSize:11,border:`1.5px dashed ${G.border}`,borderRadius:8}}>
                                  인물을 추가하세요 (최소 1명)
                                </div>
                              )}
                              {kybPersons.map((p,pi)=>(
                                <div key={p.id} style={{border:`1px solid ${G.border}`,borderRadius:9,marginBottom:10,overflow:"hidden"}}>
                                  <div style={{padding:"10px 14px",background:G.sidebar,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                    <div style={{fontWeight:700,fontSize:12}}>{p.name||`인물 ${pi+1}`}</div>
                                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                                      {p.sumsubStatus==="verified"?(
                                        <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:G.greenLight,color:G.greenDark,fontWeight:700}}>✓ 인증 완료</span>
                                      ):(
                                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                                          <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:"#FFFBEB",color:"#B45309",fontWeight:700}}>인증 필요</span>
                                          <button onClick={()=>{setKybPersons(ps=>ps.map(x=>x.id===p.id?{...x,sumsubStatus:"verified"}:x));T(`📧 ${p.name||"인물"} Sumsub 인증 링크 발송`);}}
                                            style={{fontSize:9,padding:"3px 8px",borderRadius:4,border:"1px solid #B45309",background:"#FFF8EE",color:"#B45309",cursor:"pointer",fontWeight:600}}>Sumsub 인증 링크 발송</button>
                                        </div>
                                      )}
                                      <button onClick={()=>setKybPersons(ps=>ps.filter(x=>x.id!==p.id))}
                                        style={{fontSize:9,padding:"3px 7px",borderRadius:4,border:`1px solid ${G.red}`,background:"#FFF5F5",color:G.red,cursor:"pointer",fontWeight:600}}>제거</button>
                                    </div>
                                  </div>
                                  <div style={{padding:"14px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
                                    <div style={{gridColumn:"1/-1",marginBottom:10}}>
                                      <Lbl t="역할* (복수 선택 가능)"/>
                                      <div style={{display:"flex",gap:8}}>
                                        {PERSON_ROLES.map(role=>(
                                          <label key={role} style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:11}}>
                                            <input type="checkbox" checked={p.roles.includes(role)}
                                              onChange={e=>setKybPersons(ps=>ps.map(x=>x.id===p.id?{...x,roles:e.target.checked?[...x.roles,role]:x.roles.filter(r=>r!==role)}:x))}
                                              style={{accentColor:G.green}}/>
                                            {role}
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                    <div><Lbl t="영문 성명*"/><Inp v={p.name} set={v=>setKybPersons(ps=>ps.map(x=>x.id===p.id?{...x,name:v}:x))} ph="Full Name (English)"/></div>
                                    <div><Lbl t="국적 (ISO alpha-2)*"/><Inp v={p.nationality} set={v=>setKybPersons(ps=>ps.map(x=>x.id===p.id?{...x,nationality:v}:x))} ph="예: KR"/></div>
                                    <div><Lbl t="생년월일 (yyyy-MM-dd)*"/><Inp v={p.birthDate} set={v=>setKybPersons(ps=>ps.map(x=>x.id===p.id?{...x,birthDate:v}:x))} ph="1990-01-01"/></div>
                                    <div><Lbl t="거주 국가 (ISO alpha-2)*"/><Inp v={p.residenceCountry} set={v=>setKybPersons(ps=>ps.map(x=>x.id===p.id?{...x,residenceCountry:v}:x))} ph="예: KR"/></div>
                                    <div>
                                      <Lbl t="여권 / 신분증 업로드*"/>
                                      {p.docFile?(
                                        <div style={{display:"flex",alignItems:"center",gap:6,background:G.greenLight,borderRadius:6,padding:"6px 10px",fontSize:11}}>
                                          <span>📎</span><span style={{flex:1,fontWeight:600}}>{p.docFile}</span>
                                          <button onClick={()=>setKybPersons(ps=>ps.map(x=>x.id===p.id?{...x,docFile:null}:x))} style={{fontSize:10,color:G.red,background:"none",border:"none",cursor:"pointer"}}>×</button>
                                        </div>
                                      ):(
                                        <div style={{border:`1.5px dashed ${G.border}`,borderRadius:6,padding:"10px",textAlign:"center",cursor:"pointer",fontSize:10,color:G.textMid,marginBottom:10}}
                                          onClick={()=>document.getElementById(`kp-doc-${p.id}`).click()}>
                                          📁 파일 선택
                                          <input id={`kp-doc-${p.id}`} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{display:"none"}}
                                            onChange={e=>{if(e.target.files[0]){if(e.target.files[0].size>15*1024*1024){T("⚠️ 파일 크기는 15MB를 초과할 수 없습니다.");return;}setKybPersons(ps=>ps.map(x=>x.id===p.id?{...x,docFile:e.target.files[0].name}:x));e.target.value="";}}}/>
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <Lbl t="개인 주소 증명 (3개월 이내)*"/>
                                      {p.addressFile?(
                                        <div style={{display:"flex",alignItems:"center",gap:6,background:G.greenLight,borderRadius:6,padding:"6px 10px",fontSize:11}}>
                                          <span>📎</span><span style={{flex:1,fontWeight:600}}>{p.addressFile}</span>
                                          <button onClick={()=>setKybPersons(ps=>ps.map(x=>x.id===p.id?{...x,addressFile:null}:x))} style={{fontSize:10,color:G.red,background:"none",border:"none",cursor:"pointer"}}>×</button>
                                        </div>
                                      ):(
                                        <div style={{border:`1.5px dashed ${G.border}`,borderRadius:6,padding:"10px",textAlign:"center",cursor:"pointer",fontSize:10,color:G.textMid,marginBottom:10}}
                                          onClick={()=>document.getElementById(`kp-addr-${p.id}`).click()}>
                                          📁 파일 선택
                                          <input id={`kp-addr-${p.id}`} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{display:"none"}}
                                            onChange={e=>{if(e.target.files[0]){if(e.target.files[0].size>15*1024*1024){T("⚠️ 파일 크기는 15MB를 초과할 수 없습니다.");return;}setKybPersons(ps=>ps.map(x=>x.id===p.id?{...x,addressFile:e.target.files[0].name}:x));e.target.value="";}}}/>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* ── Section 4: Related Companies ── */}
                          {sec.id===4&&(
                            <div>
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                                <div style={{fontSize:11,color:G.textMid}}>지분 25% 이상 모회사 또는 지배 법인이 있을 경우 등록.</div>
                                <Btn t="+ 법인 추가" sm onClick={()=>{setKybNoCompany(false);setKybCompanies(cs=>[...cs,{id:Date.now(),name:"",registrationNo:"",country:"KR",relation:"모회사"}]);}}/>
                              </div>
                              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:12,marginBottom:12,padding:"10px 14px",background:kybNoCompany?G.greenLight:"#FAFAFA",borderRadius:8,border:`1px solid ${kybNoCompany?G.green:G.border}`}}>
                                <input type="checkbox" checked={kybNoCompany} onChange={e=>{setKybNoCompany(e.target.checked);if(e.target.checked)setKybCompanies([]);}} style={{accentColor:G.green}}/>
                                <span style={{fontWeight:kybNoCompany?700:400,color:kybNoCompany?G.greenDark:G.textMid}}>관련 법인 없음 (해당 없음)</span>
                              </label>
                              {!kybNoCompany&&kybCompanies.map((co,ci)=>(
                                <div key={co.id} style={{border:`1px solid ${G.border}`,borderRadius:8,marginBottom:8,padding:"14px"}}>
                                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                                    <div style={{fontWeight:700,fontSize:12}}>{co.name||`법인 ${ci+1}`}</div>
                                    <button onClick={()=>setKybCompanies(cs=>cs.filter(x=>x.id!==co.id))}
                                      style={{fontSize:10,padding:"2px 8px",borderRadius:4,border:`1px solid ${G.red}`,background:"#FFF5F5",color:G.red,cursor:"pointer",fontWeight:600}}>제거</button>
                                  </div>
                                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
                                    <div><Lbl t="법인명*"/><Inp v={co.name} set={v=>setKybCompanies(cs=>cs.map(x=>x.id===co.id?{...x,name:v}:x))} ph="법인명"/></div>
                                    <div><Lbl t="사업자등록번호*"/><Inp v={co.registrationNo} set={v=>setKybCompanies(cs=>cs.map(x=>x.id===co.id?{...x,registrationNo:v}:x))} ph="등록번호"/></div>
                                    <div><Lbl t="설립 국가 (ISO alpha-2)*"/><Inp v={co.country} set={v=>setKybCompanies(cs=>cs.map(x=>x.id===co.id?{...x,country:v}:x))} ph="예: KR"/></div>
                                    <div>
                                      <Lbl t="관계*"/>
                                      <Sel v={co.relation} set={v=>setKybCompanies(cs=>cs.map(x=>x.id===co.id?{...x,relation:v}:x))} opts={["모회사","자회사","계열사","지배주주"]}/>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {!kybNoCompany&&kybCompanies.length===0&&(
                                <div style={{textAlign:"center",padding:"20px",color:G.textLight,fontSize:11,border:`1.5px dashed ${G.border}`,borderRadius:8}}>
                                  법인을 추가하거나 "관련 법인 없음"을 체크하세요.
                                </div>
                              )}
                            </div>
                          )}

                          {/* ── Section 5: Submission Info ── */}
                          {sec.id===5&&(
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
                              <div style={{gridColumn:"1/-1"}}>
                                <Lbl t="담당자 이메일*"/>
                                <Inp v={kybForm.email} set={v=>setKybForm(fm=>({...fm,email:v}))} ph="admin@company.com"/>
                              </div>
                              <div>
                                <Lbl t="IP 주소*"/>
                                <Inp v={kybForm.ip} set={v=>setKybForm(fm=>({...fm,ip:v}))} ph="자동 감지"/>
                              </div>
                              <div>
                                <Lbl t="Device ID*"/>
                                <Inp v={kybForm.deviceId} set={v=>setKybForm(fm=>({...fm,deviceId:v}))} ph="자동 생성"/>
                              </div>
                              <div style={{gridColumn:"1/-1",background:G.blueLight,borderRadius:7,padding:"9px 12px",fontSize:10,color:"#1D4ED8"}}>
                                ℹ️ IP 주소와 Device ID는 시스템 자동 감지로 기본 채워지며 수동 수정 가능합니다.
                              </div>
                            </div>
                          )}

                        </div>
                      )}
                    </div>
                  );
                })}

                {/* 하단 버튼 */}
                <div style={{display:"flex",gap:8,marginTop:16}}>
                  <Btn t="임시저장" sm color={G.textMid} onClick={()=>T("💾 임시저장 완료")}/>
                  {!isRejected&&<Btn t="제출" sm onClick={()=>handleSubmitKyb(false)}/>}
                  {isRejected&&<Btn t="재제출" sm onClick={()=>handleSubmitKyb(false)}/>}
                  <button onClick={()=>setMenu("Clients")} style={{background:"none",border:`1px solid ${G.border}`,borderRadius:6,padding:"6px 13px",fontSize:11,color:G.textMid,cursor:"pointer",fontWeight:600}}>← 목록으로</button>
                </div>

                {/* Sumsub 미완료 경고 모달 */}
                {kybSumsubWarn&&(
                  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9998}}>
                    <div style={{background:G.white,borderRadius:14,padding:28,maxWidth:360,width:"90%",boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>
                      <div style={{fontWeight:700,fontSize:14,marginBottom:10}}>⚠️ Sumsub 인증 미완료</div>
                      <div style={{fontSize:12,color:G.textMid,marginBottom:18}}>인물 Sumsub 인증이 완료되지 않았습니다. 계속 진행하시겠습니까?</div>
                      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                        <Btn t="취소" sm color={G.textMid} onClick={()=>setKybSumsubWarn(false)}/>
                        <Btn t={isRejected?"계속 재제출":"계속 제출"} sm color={G.green} onClick={()=>handleSubmitKyb(true)}/>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {menu==="Fee Settings"&&(
            <div style={{maxWidth:720}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>Fee Markup Settings</div>

              {/* OSL 기본 수수료 정보 박스 (읽기 전용) */}
              <div style={{background:"#EBF8E1",border:"1px solid #C3E6CB",borderRadius:10,padding:"14px 18px",marginBottom:18}}>
                <div style={{fontWeight:700,fontSize:12,marginBottom:10,color:"#276749"}}>OSL 기본 수수료 (읽기 전용)</div>
                <div style={{background:"white",borderRadius:7,overflow:"hidden",border:"1px solid #C3E6CB"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                    <thead><tr style={{background:"rgba(39,103,73,0.08)"}}>
                      {["항목","수수료","비고"].map(h=><th key={h} style={{padding:"7px 12px",textAlign:"left",fontWeight:700,color:"#276749"}}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {[
                        ["On-ramp Base Fee","0%","USD → USDC/USDT (OSL 고정)"],
                        ["Off-ramp Base Fee","0.2%","USDC/USDT → USD (OSL 고정)"],
                        ["Wire Fee","$35 / 건","$100K 이상 면제"],
                        ["네트워크 수수료","없음","OSL 내부 처리"],
                      ].map(([a,b,c])=>(
                        <tr key={a}>
                          <td style={{padding:"7px 12px",borderTop:"1px solid #C3E6CB",color:"#276749",fontWeight:600}}>{a}</td>
                          <td style={{padding:"7px 12px",borderTop:"1px solid #C3E6CB",color:"#276749",fontWeight:700}}>{b}</td>
                          <td style={{padding:"7px 12px",borderTop:"1px solid #C3E6CB",color:"#276749"}}>{c}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 고객사별 Markup 테이블 */}
              <div style={{fontWeight:700,fontSize:13,marginBottom:8}}>고객사별 Markup 설정</div>
              <div style={{fontSize:11,color:G.textLight,marginBottom:12}}>KYB ACTIVE + 이메일 초대 완료 · Active 계정만 표시. Sub Account에는 합산 수수료만 노출됩니다.</div>
              <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:10,overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead>
                    <tr style={{background:"#F7F7F5"}}>
                      <th style={{padding:"10px 14px",textAlign:"left",fontWeight:700,color:G.textMid,borderBottom:`1px solid ${G.border}`}}>고객사명</th>
                      <th style={{padding:"10px 14px",textAlign:"center",fontWeight:700,color:G.textDark,borderBottom:`1px solid ${G.border}`}}>On-ramp Markup (%)<br/><span style={{fontSize:9,fontWeight:400,color:G.textMid}}>Fiat → Crypto</span></th>
                      <th style={{padding:"10px 14px",textAlign:"center",fontWeight:700,color:"#276749",borderBottom:`1px solid ${G.border}`}}>On-ramp 최종<br/><span style={{fontSize:9,fontWeight:400,color:G.textMid}}>OSL 0% + Markup</span></th>
                      <th style={{padding:"10px 14px",textAlign:"center",fontWeight:700,color:G.textDark,borderBottom:`1px solid ${G.border}`}}>Off-ramp Markup (%)<br/><span style={{fontSize:9,fontWeight:400,color:G.textMid}}>Crypto → Fiat</span></th>
                      <th style={{padding:"10px 14px",textAlign:"center",fontWeight:700,color:"#1D4ED8",borderBottom:`1px solid ${G.border}`}}>Off-ramp 최종<br/><span style={{fontSize:9,fontWeight:400,color:G.textMid}}>OSL 0.2% + Markup</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.filter(c=>c.kybStatus==="ACTIVE"&&c.email&&c.st!=="Suspended").length===0&&(
                      <tr><td colSpan={5} style={{padding:"20px",textAlign:"center",color:G.textLight}}>KYB 승인 및 이메일 초대 완료 계정이 없습니다.</td></tr>
                    )}
                    {clients.filter(c=>c.kybStatus==="ACTIVE"&&c.email&&c.st!=="Suspended").map((c,i,arr)=>{
                      const isEditOn=editFee?.id===c.id&&editFee?.dir==="on";
                      const isEditOff=editFee?.id===c.id&&editFee?.dir==="off";
                      const onFinal=(c.muOn*100).toFixed(2);
                      const offFinal=(0.20+c.muOff*100).toFixed(2);
                      return(
                        <tr key={c.id} style={{background:i%2===0?G.white:"#FAFBF8",borderBottom:i<arr.length-1?`1px solid ${G.border}`:"none"}}>
                          <td style={{padding:"11px 14px",fontWeight:700,color:G.textDark}}>{c.name}</td>
                          {/* On-ramp Markup */}
                          <td style={{padding:"11px 14px",textAlign:"center"}}>
                            {isEditOn?(
                              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                                <input type="number" defaultValue={(c.muOn*100).toFixed(2)} id={`fs-muOn-${c.id}`} step="0.01"
                                  style={{width:60,padding:"4px 6px",borderRadius:6,border:`1.5px solid ${G.green}`,fontSize:11,outline:"none",textAlign:"right"}}/>
                                <span style={{fontSize:10,color:G.textMid}}>%</span>
                                <button onClick={()=>{
                                  const val=parseFloat(document.getElementById(`fs-muOn-${c.id}`).value)/100;
                                  setClients(cs=>cs.map(x=>x.id===c.id?{...x,muOn:val,mu:val}:x));
                                  setEditFee(null);T(`✅ ${c.name} On-ramp markup updated`);
                                }} style={{fontSize:10,padding:"3px 8px",borderRadius:5,border:`1px solid ${G.green}`,background:G.greenLight,color:G.greenDark,cursor:"pointer",fontWeight:700}}>저장</button>
                                <button onClick={()=>setEditFee(null)} style={{fontSize:10,padding:"3px 8px",borderRadius:5,border:`1px solid ${G.border}`,background:G.white,color:G.textMid,cursor:"pointer"}}>취소</button>
                              </div>
                            ):(
                              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                                <span style={{background:G.greenLight,color:G.greenDark,borderRadius:6,padding:"3px 10px",fontWeight:700,fontSize:11}}
                                  title="OSL Base 0% + IB Markup = 고객사 최종 On-ramp 수수료">
                                  +{(c.muOn*100).toFixed(2)}%
                                </span>
                                <button onClick={()=>setEditFee({id:c.id,dir:"on"})} style={{fontSize:10,padding:"3px 9px",borderRadius:5,border:`1px solid ${G.border}`,background:G.white,cursor:"pointer",color:G.textMid,fontWeight:600}}>수정</button>
                              </div>
                            )}
                          </td>
                          {/* On-ramp 최종 */}
                          <td style={{padding:"11px 14px",textAlign:"center"}}>
                            <span style={{background:"#EBF8E1",color:"#276749",borderRadius:6,padding:"3px 10px",fontWeight:700,fontSize:11}}>
                              {isEditOn
                                ? `${(parseFloat((document.getElementById(`fs-muOn-${c.id}`)?.value||c.muOn*100))).toFixed(2)}%`
                                : `${onFinal}%`}
                            </span>
                          </td>
                          {/* Off-ramp Markup */}
                          <td style={{padding:"11px 14px",textAlign:"center"}}>
                            {isEditOff?(
                              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                                <input type="number" defaultValue={(c.muOff*100).toFixed(2)} id={`fs-muOff-${c.id}`} step="0.01"
                                  style={{width:60,padding:"4px 6px",borderRadius:6,border:`1.5px solid #1D4ED8`,fontSize:11,outline:"none",textAlign:"right"}}/>
                                <span style={{fontSize:10,color:G.textMid}}>%</span>
                                <button onClick={()=>{
                                  const val=parseFloat(document.getElementById(`fs-muOff-${c.id}`).value)/100;
                                  setClients(cs=>cs.map(x=>x.id===c.id?{...x,muOff:val}:x));
                                  setEditFee(null);T(`✅ ${c.name} Off-ramp markup updated`);
                                }} style={{fontSize:10,padding:"3px 8px",borderRadius:5,border:"1px solid #1D4ED8",background:"#DBEAFE",color:"#1D4ED8",cursor:"pointer",fontWeight:700}}>저장</button>
                                <button onClick={()=>setEditFee(null)} style={{fontSize:10,padding:"3px 8px",borderRadius:5,border:`1px solid ${G.border}`,background:G.white,color:G.textMid,cursor:"pointer"}}>취소</button>
                              </div>
                            ):(
                              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                                <span style={{background:"#DBEAFE",color:"#1D4ED8",borderRadius:6,padding:"3px 10px",fontWeight:700,fontSize:11}}
                                  title="OSL Base 0.2% + IB Markup = 고객사 최종 Off-ramp 수수료">
                                  +{(c.muOff*100).toFixed(2)}%
                                </span>
                                <button onClick={()=>setEditFee({id:c.id,dir:"off"})} style={{fontSize:10,padding:"3px 9px",borderRadius:5,border:`1px solid ${G.border}`,background:G.white,cursor:"pointer",color:G.textMid,fontWeight:600}}>수정</button>
                              </div>
                            )}
                          </td>
                          {/* Off-ramp 최종 */}
                          <td style={{padding:"11px 14px",textAlign:"center"}}>
                            <span style={{background:"#DBEAFE",color:"#1D4ED8",borderRadius:6,padding:"3px 10px",fontWeight:700,fontSize:11}}>
                              {offFinal}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 사이드 패널 */}
      {selectedTx&&<OrderSidePanel tx={selectedTx} onClose={()=>setSelectedTx(null)} isMaster={selectedTx.acct==="Master"}/>}

      {toast&&<div style={{position:"fixed",bottom:20,right:20,background:"#1A1A1A",color:"#fff",borderRadius:8,padding:"10px 18px",fontSize:12,fontWeight:600,boxShadow:"0 4px 16px rgba(0,0,0,0.15)",zIndex:9999}}>{toast}</div>}
    </div>
  );
}

export default function App(){
  const [screen,setScreen]=useState("dash");
  const [mode,setMode]=useState("master");
  const [acctName,setAcctName]=useState("Hanpass");
  if(screen==="login") return <LoginPage onLogin={(m,a,isFirst)=>{setMode(m);setAcctName(a||"Hanpass");setScreen(isFirst?"first":"dash");}}/>;
  if(screen==="first") return <FirstLogin acct={acctName} onDone={()=>setScreen("dash")}/>;
  if(mode==="master") return <MasterDash onLogout={()=>setScreen("login")} onSub={()=>setMode("sub")}/>;
  return <SubDash acctName={acctName} onLogout={()=>setScreen("login")} onMaster={()=>setMode("master")}/>;
}