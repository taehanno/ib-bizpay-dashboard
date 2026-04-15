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

const NETWORKS = { USD:[], HKD:[], USDC:["ERC-20","Base"], USDT:["ERC-20","TRC-20"] };
const NET_COLOR = {
  "ERC-20":   { bg:"#EDE9FE", text:"#7C3AED" },
  "Base":     { bg:"#DBEAFE", text:"#1D4ED8" },
  "TRC-20":   { bg:"#CCFBF1", text:"#0D9488" },
  "BNB-20":   { bg:"#FEF9C3", text:"#B45309" },
  "SWIFT":    { bg:"#F0FDF4", text:"#166534" },
  "Local Bank":{ bg:"#EFF6FF", text:"#1D4ED8" },
  "":         { bg:"#F3F4F6", text:"#6B7280" },
};

const ACCOUNTS = {
  Hanpass:{ id:"ID:17615-HNP", email:"admin@hanpass.com", kybStatus:"ACTIVE",   kybInfo:{name:"Hanpass Corp.",  registrationNo:"110-81-55000", country:"KR", address:"Seoul, Republic of Korea"}, balances:{ USD:{total:12450}, USDC:{"ERC-20":5200.50,"Base":3120.00}, USDT:{"ERC-20":2100.00,"TRC-20":3000.00} } },
  Sentbe: { id:"ID:17616-STB", email:"admin@sentbe.com",  kybStatus:"INACTIVE", kybInfo:null,                                                                                                    balances:{ USD:{total:3200},  USDC:{"ERC-20":900.75,"Base":600.00},   USDT:{"ERC-20":480.00,"TRC-20":500.00} } },
  MOIN:   { id:"ID:17617-MON", email:"admin@moin.money",  kybStatus:"ACTIVE",   kybInfo:{name:"MOIN Corp.",     registrationNo:"110-81-77000", country:"KR", address:"Seoul, Republic of Korea"}, balances:{ USD:{total:7800},  USDC:{"ERC-20":2000.00,"Base":2200.00}, USDT:{"ERC-20":1100.50,"TRC-20":1200.00} } },
};
const MASTER_BAL = { USD:{total:52340}, USDC:{"ERC-20":18600,"Base":12600}, USDT:{"ERC-20":9400,"TRC-20":9500} };

// ── TX_DATA (확장 필드 포함) ──────────────────────────────────────────
const TX_DATA = [
  {
    id:"TX-041", date:"2026-03-29 14:32", type:"Payout", acct:"Hanpass",
    recipientName:"Kim Jae-won", recipientAccount:"Citibank **** 4821", recipientBank:"Citibank",
    amt:"-1,200", cur:"USD", network:"SWIFT", st:"Completed",
    txid:"0xABCD...1234",
    fromName:"Hanpass Corp.", fromAccount:"SGB Bank **** 9901", fromBank:"SGB Bank",
    fromAmt:null, fromCur:null, fromNet:null,
    fxRate:null, fxFee:null,
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
    fromAmt:null, fromCur:null, fromNet:null,
    fxRate:null, fxFee:null,
  },
  {
    id:"TX-038", date:"2026-03-26 11:20", type:"Deposit", acct:"Hanpass",
    recipientName:"Hanpass Corp.", recipientAccount:"SGB Bank **** 9901", recipientBank:"SGB Bank",
    amt:"+3,000", cur:"USD", network:"SWIFT", st:"Completed",
    txid:"SWIFT-REF-882211",
    fromName:"Hanpass Corp.", fromAccount:"하나은행 **** 3310", fromBank:"하나은행",
    fromAmt:"3,000", fromCur:"USD", fromNet:"",
    fxRate:null, fxFee:null,
  },
  {
    id:"TX-037", date:"2026-03-25 08:44", type:"Payout", acct:"Sentbe",
    recipientName:"Tokyo Trading Ltd", recipientAccount:"MUFG **** 3390", recipientBank:"MUFG",
    amt:"-2,500", cur:"USD", network:"SWIFT", st:"Failed",
    txid:"FAILED",
    fromName:"Sentbe Corp.", fromAccount:"SGB Bank **** 4455", fromBank:"SGB Bank",
    fromAmt:null, fromCur:null, fromNet:null,
    fxRate:null, fxFee:null,
  },
  {
    id:"TX-036", date:"2026-03-24 13:05", type:"Payout", acct:"MOIN",
    recipientName:"0xA1b...d44A", recipientAccount:"0xA1b9...d44A", recipientBank:null,
    amt:"-400", cur:"USDT", network:"TRC-20", st:"Completed",
    txid:"0x1122...AABB",
    fromName:"MOIN Corp.", fromAccount:"SGB Bank **** 7712", fromBank:"SGB Bank",
    fromAmt:null, fromCur:null, fromNet:null,
    fxRate:null, fxFee:null,
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
  },
  {
    id:"TX-033", date:"2026-03-21 09:55", type:"Deposit", acct:"MOIN",
    recipientName:"MOIN Corp.", recipientAccount:"SGB Bank **** 7712", recipientBank:"SGB Bank",
    amt:"+2,500", cur:"USD", network:"SWIFT", st:"Completed",
    txid:"SWIFT-REF-556677",
    fromName:"MOIN Corp.", fromAccount:"국민은행 **** 5599", fromBank:"국민은행",
    fromAmt:"2,500", fromCur:"USD", fromNet:"",
    fxRate:null, fxFee:null,
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
  {id:"SUB-003",name:"MOIN",     email:"admin@moin.money", st:"Active",   created:"2026-02-20",mu:0.10,muOn:0.10,muOff:0.10,otpReq:false,locked:true,  kybStatus:"ACTIVE"},
  {id:"SUB-004",name:"WireKorea",email:"admin@wirek.com",  st:"Suspended",created:"2026-03-01",mu:0.20,muOn:0.20,muOff:0.20,otpReq:false,locked:false, kybStatus:"REJECTED"},
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
  {id:1,recipientId:1,recipientName:"Kim Jae-won",       registrationNo:"110-81-12345",docType:"Invoice",  totalApproved:500000,usedAmount:320000,frozenAmount:50000, status:"ACTIVE",  validFrom:"2025-01-01",validTo:"2025-12-31"},
  {id:2,recipientId:2,recipientName:"Tokyo Trading Ltd", registrationNo:"1234567890",  docType:"Contract", totalApproved:200000,usedAmount:180000,frozenAmount:10000, status:"PENDING", validFrom:"2025-03-01",validTo:"2025-09-30"},
  {id:3,recipientId:3,recipientName:"USDC ERC-20 Wallet",registrationNo:"US123456",    docType:"Invoice",  totalApproved:100000,usedAmount:10000, frozenAmount:5000,  status:"ACTIVE",  validFrom:"2025-01-01",validTo:"2025-12-31"},
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
    ],
    USDT:[
      {network:"ERC-20", address:"0xERC20usdt1234567890ABCDEF1234567890abcd"},
      {network:"TRC-20", address:"TRX1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZab"},
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
      ],
      USDT:[
        {network:"ERC-20",address:"0xHNP_ERC20_usdt_ABCDEF1234567890abcdef12"},
        {network:"TRC-20",address:"THNP_TRC20_usdt_1234567890ABCDEFGHIJKLab"},
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
      ],
      USDT:[
        {network:"ERC-20",address:"0xSTB_ERC20_usdt_9876543210ABCDEF98765432"},
        {network:"TRC-20",address:"TSTB_TRC20_usdt_9876543210ABCDEFGHIJKLcd"},
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
      ],
      USDT:[
        {network:"ERC-20",address:"0xMON_ERC20_usdt_CCCCDDDD5555666677778888"},
        {network:"TRC-20",address:"TMON_TRC20_usdt_5555666677778888CCCCDDef"},
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
  const avail=Math.max(0,total-used-frozen);
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
  if(type==="Convert") return <span style={{background:"#FEF3C7",color:"#92400E",borderRadius:20,padding:"2px 9px",fontWeight:700,fontSize:10,whiteSpace:"nowrap"}}>🔄 Convert</span>;
  if(type==="Deposit") return <span style={{background:"#DBEAFE",color:"#1D4ED8",borderRadius:20,padding:"2px 9px",fontWeight:700,fontSize:10,whiteSpace:"nowrap"}}>🏦 Deposit</span>;
  if(type==="Payout")  return <span style={{background:"#DCFCE7",color:"#166534",borderRadius:20,padding:"2px 9px",fontWeight:700,fontSize:10,whiteSpace:"nowrap"}}>💸 Payout</span>;
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
function SidePanelRow({label,value,sub,mono}){
  return(
    <div style={{marginBottom:12}}>
      <div style={{fontSize:10,fontWeight:700,color:G.textLight,textTransform:"uppercase",letterSpacing:0.4,marginBottom:3}}>{label}</div>
      <div style={{fontWeight:600,fontSize:12,color:G.textDark,wordBreak:"break-all",...(mono?{fontFamily:"monospace",fontSize:11}:{})}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:G.textMid,marginTop:2}}>{sub}</div>}
    </div>
  );
}

function OrderSidePanel({tx,onClose,isMaster=false}){
  if(!tx) return null;
  const isConvert = tx.type==="Convert";
  const isPayout  = tx.type==="Payout";
  const isDeposit = tx.type==="Deposit";
  const stC = stColor(tx.st);

  return(
    <>
      {/* 오버레이 */}
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.25)",zIndex:200}}/>
      {/* 패널 */}
      <div style={{
        position:"fixed",top:0,right:0,bottom:0,width:420,
        background:G.white,boxShadow:"-4px 0 24px rgba(0,0,0,0.12)",
        zIndex:201,display:"flex",flexDirection:"column",
        animation:"slideIn 0.22s ease"
      }}>
        <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

        {/* 헤더 */}
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${G.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <TypeBadge type={tx.type}/>
            <span style={{fontWeight:700,fontSize:13,color:G.textDark}}>{tx.id}</span>
          </div>
          <button onClick={onClose} style={{background:"transparent",border:"none",fontSize:18,cursor:"pointer",color:G.textLight,lineHeight:1}}>✕</button>
        </div>

        {/* 바디 스크롤 */}
        <div style={{flex:1,overflowY:"auto",padding:"20px"}}>

          {/* ── CONVERT 상세 ── */}
          {isConvert&&(
            <>
              {/* From */}
              <div style={{background:"#FFF8F0",border:"1px solid #FDE8C8",borderRadius:10,padding:"14px 16px",marginBottom:12}}>
                <div style={{fontSize:10,fontWeight:700,color:"#92400E",textTransform:"uppercase",marginBottom:8}}>From</div>
                <AmtChip amt={`-${tx.fromAmt}`} cur={tx.fromCur} net={tx.fromNet||undefined} color={G.red} size={15}/>
              </div>

              {/* FX Rate */}
              <div style={{background:G.sidebar,border:`1px solid ${G.border}`,borderRadius:10,padding:"12px 16px",marginBottom:12}}>
                <div style={{fontSize:10,fontWeight:700,color:G.textLight,textTransform:"uppercase",marginBottom:8}}>FX Rate & Fee</div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:11,color:G.textMid}}>Rate</span>
                  <span style={{fontSize:11,fontWeight:700,color:G.textDark}}>{tx.fxRate||"—"}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                  <span style={{fontSize:11,color:G.textMid,flexShrink:0}}>Fee</span>
                  <div style={{textAlign:"right"}}>
                    {tx.fxFee&&tx.fxFee.includes("총")?(()=>{
                      const [rate,total]=tx.fxFee.split("(총");
                      const isOnRamp=["USD","HKD"].includes(tx.fromCur)&&["USDC","USDT"].includes(tx.cur);
                      return(<>
                        <div style={{fontSize:11,fontWeight:700,color:G.orange}}>{rate.trim()}</div>
                        <div style={{fontSize:10,color:G.textMid}}>(총 {total?.replace(")","").trim()})</div>
                        {isMaster&&<div style={{fontSize:9,color:G.textLight,marginTop:2}}>OSL 도매가 {isOnRamp?"On-ramp":"Off-ramp"} 기준</div>}
                      </>);
                    })():<span style={{fontSize:11,fontWeight:700,color:G.orange}}>{tx.fxFee||"—"}</span>}
                  </div>
                </div>
              </div>

              {/* To */}
              <div style={{background:G.greenLight,border:`1px solid ${G.border}`,borderRadius:10,padding:"14px 16px",marginBottom:16}}>
                <div style={{fontSize:10,fontWeight:700,color:G.greenDark,textTransform:"uppercase",marginBottom:8}}>To</div>
                <AmtChip amt={tx.amt} cur={tx.cur} net={tx.network||undefined} color={G.greenDark} size={15}/>
              </div>
            </>
          )}

          {/* ── PAYOUT 상세 ── */}
          {isPayout&&(
            <>
              {/* 수취인 */}
              <div style={{background:"#F8F4FF",border:"1px solid #E9D8FD",borderRadius:10,padding:"14px 16px",marginBottom:12}}>
                <div style={{fontSize:10,fontWeight:700,color:"#6B21A8",textTransform:"uppercase",marginBottom:10}}>수취인 (Recipient)</div>
                <SidePanelRow label="이름 / 법인명" value={tx.recipientName}/>
                {tx.recipientBank?(
                  <SidePanelRow label="계좌" value={tx.recipientAccount} sub={tx.recipientBank}/>
                ):(
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${G.border}`}}>
                    <span style={{color:G.textLight,fontSize:11,flexShrink:0,minWidth:110}}>지갑 주소</span>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
                      <AddressChip address={tx.recipientAccount||""}/>
                      <NetBadge net={tx.network}/>
                    </div>
                  </div>
                )}
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:10,color:G.textMid}}>금액</span>
                  <AmtChip amt={tx.amt} cur={tx.cur} net={tx.network||undefined} color={G.red} size={14}/>
                </div>
              </div>

              {/* 출금 수수료 — Failed 일 때는 표시 안 함 */}
              {tx.st!=="Failed"&&(()=>{
                const isFiat=tx.network==="SWIFT"||tx.network==="Local Bank"||!EXPLORER_URL[tx.network];
                const rawAmt=parseFloat((tx.amt||"0").replace(/,/g,"").replace(/-/g,""))||0;
                const isPending=tx.st==="Pending";
                if(isFiat){
                  const fee=35;
                  return(
                    <div style={{background:G.blueLight,border:"1px solid #BEE3F8",borderRadius:10,padding:"14px 16px",marginBottom:12}}>
                      <div style={{fontSize:10,fontWeight:700,color:"#1D4ED8",textTransform:"uppercase",marginBottom:10}}>출금 수수료</div>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                        <span style={{fontSize:11,color:G.textMid}}>네트워크</span><NetBadge net="SWIFT"/>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                        <span style={{fontSize:11,color:G.textMid}}>수수료 항목</span>
                        <span style={{fontSize:11,fontWeight:600}}>SWIFT 전신망 수수료</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",paddingBottom:8,borderBottom:"1px solid #BEE3F8",marginBottom:8}}>
                        <span style={{fontSize:11,color:G.textMid}}>수수료 금액</span>
                        <span style={{fontSize:11,fontWeight:700,color:G.orange}}>USD {fee}.00</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                        <span style={{fontSize:10,color:G.textMid}}>송금 요청액</span>
                        <span style={{fontSize:10,fontWeight:600}}>{rawAmt.toLocaleString()}.00 {tx.cur}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                        <span style={{fontSize:10,color:G.textMid}}>SWIFT 수수료</span>
                        <span style={{fontSize:10,fontWeight:600}}>+ {fee}.00 {tx.cur}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",background:G.greenLight,borderRadius:6,padding:"6px 10px"}}>
                        <span style={{fontSize:11,fontWeight:700,color:G.textDark}}>{isPending?"예상 총 차감액":"총 차감액"}</span>
                        <span style={{fontSize:11,fontWeight:700,color:G.red}}>{(rawAmt+fee).toLocaleString()}.00 {tx.cur}</span>
                      </div>
                    </div>
                  );
                } else {
                  const GAS_FEES={"ERC-20":3.50,"Base":0.05,"TRC-20":1.00};
                  const gasFee=GAS_FEES[tx.network]||0.05;
                  return(
                    <div style={{background:G.blueLight,border:"1px solid #BEE3F8",borderRadius:10,padding:"14px 16px",marginBottom:12}}>
                      <div style={{fontSize:10,fontWeight:700,color:"#1D4ED8",textTransform:"uppercase",marginBottom:10}}>출금 수수료</div>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                        <span style={{fontSize:11,color:G.textMid}}>네트워크</span><NetBadge net={tx.network}/>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                        <span style={{fontSize:11,color:G.textMid}}>수수료 항목</span>
                        <span style={{fontSize:11,fontWeight:600}}>네트워크 가스비</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",paddingBottom:8,borderBottom:"1px solid #BEE3F8",marginBottom:8}}>
                        <span style={{fontSize:11,color:G.textMid}}>수수료 금액</span>
                        <span style={{fontSize:11,fontWeight:700,color:G.orange}}>≈ {gasFee} {tx.cur}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                        <span style={{fontSize:10,color:G.textMid}}>송금 요청액</span>
                        <span style={{fontSize:10,fontWeight:600}}>{rawAmt.toLocaleString()} {tx.cur}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                        <span style={{fontSize:10,color:G.textMid}}>가스비</span>
                        <span style={{fontSize:10,fontWeight:600}}>+ {gasFee} {tx.cur}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",background:G.greenLight,borderRadius:6,padding:"6px 10px",marginBottom:isPending?4:0}}>
                        <span style={{fontSize:11,fontWeight:700,color:G.textDark}}>예상 총 차감액</span>
                        <span style={{fontSize:11,fontWeight:700,color:G.red}}>{(rawAmt+gasFee).toFixed(2)} {tx.cur}</span>
                      </div>
                      {isPending&&<div style={{fontSize:9,color:G.textLight,textAlign:"right"}}>* 가스비는 처리 시점에 확정됩니다.</div>}
                    </div>
                  );
                }
              })()}

              {/* From */}
              <div style={{background:G.sidebar,border:`1px solid ${G.border}`,borderRadius:10,padding:"14px 16px",marginBottom:16}}>
                <div style={{fontSize:10,fontWeight:700,color:G.textLight,textTransform:"uppercase",marginBottom:10}}>From (송금인)</div>
                <SidePanelRow label="이름 / 법인명" value={tx.fromName}/>
                <SidePanelRow label="계좌" value={tx.fromAccount} sub={tx.fromBank}/>
              </div>
            </>
          )}

          {/* ── DEPOSIT 상세 ── */}
          {isDeposit&&(
            <>
              {/* 수취인 */}
              <div style={{background:G.blueLight,border:"1px solid #BEE3F8",borderRadius:10,padding:"14px 16px",marginBottom:12}}>
                <div style={{fontSize:10,fontWeight:700,color:G.blue,textTransform:"uppercase",marginBottom:10}}>수취인 (To)</div>
                <SidePanelRow label="이름 / 법인명" value={tx.recipientName}/>
                <SidePanelRow label="계좌" value={tx.recipientAccount} sub={tx.recipientBank}/>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:10,color:G.textMid}}>입금액</span>
                  <AmtChip amt={tx.amt} cur={tx.cur} net={tx.network||undefined} color={G.greenDark} size={14}/>
                </div>
              </div>

              {/* From */}
              <div style={{background:G.sidebar,border:`1px solid ${G.border}`,borderRadius:10,padding:"14px 16px",marginBottom:16}}>
                <div style={{fontSize:10,fontWeight:700,color:G.textLight,textTransform:"uppercase",marginBottom:10}}>From (송금인)</div>
                <SidePanelRow label="이름 / 법인명" value={tx.fromName}/>
                <SidePanelRow label="계좌" value={tx.fromAccount} sub={tx.fromBank}/>
                <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
                  <span style={{fontSize:10,color:G.textMid}}>출금액</span>
                  <AmtChip amt={`-${tx.fromAmt}`} cur={tx.fromCur||tx.cur} color={G.red} size={14}/>
                </div>
              </div>
            </>
          )}

          {/* ── 공통: 상태 + TXID + 시간 ── */}
          <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:10,padding:"14px 16px"}}>
            <div style={{fontSize:10,fontWeight:700,color:G.textLight,textTransform:"uppercase",marginBottom:10}}>거래 정보</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{fontSize:11,color:G.textMid}}>상태</span>
              <Badge t={tx.st} color={stC}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{fontSize:11,color:G.textMid}}>TX ID</span>
              <span style={{fontSize:10,fontWeight:600,color:G.textDark,fontFamily:"monospace"}}>{tx.id}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,gap:8}}>
              <span style={{fontSize:11,color:G.textMid,flexShrink:0}}>Chain TXID</span>
              <div style={{textAlign:"right"}}>
                <ExplorerLink txid={tx.txid} network={tx.network}/>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:11,color:G.textMid}}>시간</span>
              <span style={{fontSize:11,color:G.textDark,fontWeight:600}}>{tx.date}</span>
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

  const netColors={"ERC-20":NET_COLOR["ERC-20"],"Base":NET_COLOR["Base"],"TRC-20":NET_COLOR["TRC-20"]};

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
    const GAS_FEE={"ERC-20":"3.50","Base":"0.05","TRC-20":"1.00"};
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
                <Btn t="📥 Export" sm onClick={()=>exportCSV(filtTx,[{l:"TX ID",k:"id"},{l:"Date",k:"date"},{l:"Type",k:"type"},{l:"Recipient",k:"recipientName"},{l:"From Cur",k:"fromCur"},{l:"From Amt",k:"fromAmt"},{l:"To Cur",k:"cur"},{l:"To Amt",k:"amt"},{l:"Network",k:"network"},{l:"Status",k:"st"},{l:"TXID",k:"txid"}],`orders_${acct}.csv`)}/>
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
            const nextDisabled=!poRec||!poAmt||!origOk||(poType==="Crypto"&&(!poNet||poFeeLoading||!poGasFee||poFeeError));
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
                      <div style={{fontSize:12,fontWeight:700,color:"#2B6CB0",marginBottom:10}}>🏦 SWIFT 전신망 수수료</div>
                      {isLargeAmt?(
                        <div style={{fontSize:11,color:"#2B6CB0",lineHeight:1.6}}>
                          💬 100,000 USD 이상은 수수료가 별도 책정됩니다. 담당자에게 문의하세요.
                        </div>
                      ):(
                        <>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                            <span style={{fontSize:11,color:G.textMid}}>송금 요청액</span>
                            <span style={{fontSize:11,fontWeight:600}}>{poAmtNum.toLocaleString("en-US",{minimumFractionDigits:2})} {poCur}</span>
                          </div>
                          <div style={{display:"flex",justifyContent:"space-between",paddingBottom:8,borderBottom:"1px solid #BEE3F8",marginBottom:8}}>
                            <span style={{fontSize:11,color:G.textMid}}>SWIFT 수수료</span>
                            <span style={{fontSize:11,fontWeight:700,color:G.orange}}>+ {swiftFee}.00 {poCur}</span>
                          </div>
                          <div style={{display:"flex",justifyContent:"space-between"}}>
                            <span style={{fontSize:13,fontWeight:700}}>총 차감액</span>
                            <span style={{fontSize:14,fontWeight:700,color:G.textDark}}>{(poAmtNum+swiftFee).toLocaleString("en-US",{minimumFractionDigits:2})} {poCur}</span>
                          </div>
                          <div style={{fontSize:10,color:"#2B6CB0",marginTop:8}}>ℹ️ 100,000 USD 미만 건당 USD 35</div>
                        </>
                      )}
                    </div>
                  )}
                  {/* Crypto 가스비 블록 */}
                  {poType==="Crypto"&&poAmt&&poNet&&(
                    <div style={{background:poFeeLoading?G.sidebar:"#FFFBEB",border:`1px solid ${poFeeLoading?G.border:"#FDE68A"}`,borderRadius:10,padding:"14px 16px",marginBottom:12}}>
                      <div style={{fontSize:12,fontWeight:700,color:"#92400E",marginBottom:10}}>🔗 네트워크 가스비 (예상)</div>
                      {poFeeError?(
                        <>
                          <div style={{fontSize:11,color:G.red,marginBottom:8}}>수수료를 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.</div>
                          <button onClick={()=>{setPoFeeError(false);setPoFeeLoading(true);setTimeout(()=>{setPoGasFee("0.05");setPoFeeLoading(false);},800);}}
                            style={{fontSize:11,padding:"5px 12px",borderRadius:6,border:`1px solid ${G.border}`,background:G.white,cursor:"pointer",fontWeight:600}}>재시도</button>
                        </>
                      ):poFeeLoading?(
                        <div style={{display:"flex",alignItems:"center",gap:8,color:G.textMid,fontSize:11}}>
                          <div style={{width:14,height:14,border:`2px solid ${G.green}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite",flexShrink:0}}/>
                          로딩 중...
                        </div>
                      ):(
                        <>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                            <span style={{fontSize:11,color:G.textMid}}>송금 요청액</span>
                            <span style={{fontSize:11,fontWeight:600}}>{poAmtNum.toLocaleString("en-US",{minimumFractionDigits:2})} {poCur}</span>
                          </div>
                          <div style={{display:"flex",justifyContent:"space-between",paddingBottom:8,borderBottom:"1px solid #FDE68A",marginBottom:8}}>
                            <span style={{fontSize:11,color:G.textMid}}>예상 가스비</span>
                            <span style={{fontSize:11,fontWeight:700,color:G.orange}}>+ {poGasFee} {poCur}</span>
                          </div>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                            <span style={{fontSize:13,fontWeight:700}}>예상 총 차감액</span>
                            <span style={{fontSize:14,fontWeight:700,color:G.textDark}}>{(poAmtNum+parseFloat(poGasFee||0)).toFixed(2)} {poCur}</span>
                          </div>
                          <div style={{fontSize:10,color:"#92400E"}}>⚠️ 실제 가스비는 처리 시점에 확정되며 변동될 수 있습니다.</div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Payout 실행 버튼 */}
                <button disabled={nextDisabled}
                  onClick={()=>{
                    if(!poRec||!poAmt){T("⚠️ 수취인/금액을 입력하세요");return;}
                    if(!origOk){T("⚠️ 송금인 정보를 입력하세요");return;}
                    if(poType==="Crypto"&&!poNet){T("⚠️ 네트워크를 선택하세요");return;}
                    if(poType==="Crypto"&&(!poGasFee||poFeeError)){T("⚠️ 가스비 로딩 완료 후 진행하세요");return;}
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
                    const fee=poType==="Fiat"?`+ 35.00 ${poCur}`:`+ ${poGasFee||"0.05"} ${poCur}`;
                    const total=poType==="Fiat"?`${(amtN+35).toLocaleString("en-US",{minimumFractionDigits:2})} ${poCur}`:`${(amtN+parseFloat(poGasFee||"0.05")).toFixed(2)} ${poCur}`;
                    return [["수취인",poRecName],[`금액`,`${amtN.toLocaleString("en-US",{minimumFractionDigits:2})} ${poCur}`],["수수료",fee],["총 차감액",total],["네트워크",poNetDisplay]];
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
                  {/* 한도 신청 폼 (인라인) */}
                  {quotaFormRecId&&(
                    <Card style={{marginBottom:16,border:`1.5px solid ${G.green}`}}>
                      <div style={{fontWeight:700,fontSize:12,color:G.greenDark,marginBottom:12}}>➕ 한도 신청</div>
                      <Lbl t="수취인 선택*"/>
                      <select value={quotaForm.recipientId} onChange={e=>setQuotaForm(q=>({...q,recipientId:e.target.value}))}
                        style={{width:"100%",padding:"8px 11px",borderRadius:7,border:`1px solid ${G.border}`,fontSize:12,marginBottom:10,background:G.white,boxSizing:"border-box"}}>
                        <option value="">수취인 선택...</option>
                        {recs.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                      <Lbl t="서류 유형*"/>
                      <div style={{display:"flex",gap:7,marginBottom:10}}>
                        {["Invoice","Contract"].map(dt=>(
                          <button key={dt} onClick={()=>setQuotaForm(q=>({...q,docType:dt}))}
                            style={{flex:1,padding:"7px",borderRadius:7,border:`1.5px solid ${quotaForm.docType===dt?G.green:G.border}`,background:quotaForm.docType===dt?G.greenLight:G.white,fontWeight:quotaForm.docType===dt?700:400,cursor:"pointer",color:quotaForm.docType===dt?G.greenDark:G.textMid,fontSize:12}}>
                            {dt}
                          </button>
                        ))}
                      </div>
                      <Lbl t="통화"/>
                      <div style={{padding:"8px 11px",borderRadius:7,border:`1px solid ${G.border}`,fontSize:12,marginBottom:10,background:"#F9FAFB",color:G.textMid}}>USD (고정)</div>
                      <Lbl t="신청 한도 금액 (USD)*"/>
                      <Inp v={quotaForm.amount} set={v=>setQuotaForm(q=>({...q,amount:v}))} ph="0.01 ~ 999,999,999.99"/>
                      <div style={{display:"flex",gap:8}}>
                        <div style={{flex:1}}><Lbl t="유효 시작일"/><Inp v={quotaForm.validFrom} set={v=>setQuotaForm(q=>({...q,validFrom:v}))} ph="yyyy-MM-dd"/></div>
                        <div style={{flex:1}}><Lbl t="유효 종료일"/><Inp v={quotaForm.validTo} set={v=>setQuotaForm(q=>({...q,validTo:v}))} ph="yyyy-MM-dd"/></div>
                      </div>
                      <Lbl t="서류 업로드 (PDF / JPG / PNG, max 10MB)*"/>
                      <div style={{border:`1.5px dashed ${G.border}`,borderRadius:7,padding:"16px",textAlign:"center",marginBottom:12,background:"#FAFAFA",fontSize:11,color:G.textMid,cursor:"pointer"}}
                        onClick={()=>document.getElementById("q2-file").click()}>
                        {quotaForm.file?`📎 ${quotaForm.file}`:"파일 선택 또는 드래그 앤 드롭"}
                        <input id="q2-file" type="file" accept=".pdf,.jpg,.jpeg,.png" style={{display:"none"}}
                          onChange={e=>{if(e.target.files[0])setQuotaForm(q=>({...q,file:e.target.files[0].name}));}}/>
                      </div>
                      <div style={{display:"flex",gap:7}}>
                        <Btn t="한도 신청 완료" sm onClick={()=>{
                          if(!quotaForm.recipientId){T("⚠️ 수취인을 선택하세요");return;}
                          if(!quotaForm.amount){T("⚠️ 한도 금액을 입력하세요");return;}
                          if(!quotaForm.file){T("⚠️ 서류를 업로드하세요");return;}
                          const rec=recs.find(r=>String(r.id)===String(quotaForm.recipientId));
                          const newQ={id:Date.now(),recipientId:Number(quotaForm.recipientId),recipientName:rec?.name||"",registrationNo:rec?.registrationNo||"",docType:quotaForm.docType,totalApproved:parseFloat(quotaForm.amount)||0,usedAmount:0,frozenAmount:0,status:"PENDING",validFrom:quotaForm.validFrom,validTo:quotaForm.validTo};
                          setQuotas(qs=>[...qs,newQ]);setQuotaFormRecId(null);
                          T("✅ 한도 신청이 제출되었습니다. 승인 후 해당 수취인으로 송금이 가능합니다.");
                        }}/>
                        <Btn t="취소" sm color={G.textLight} onClick={()=>setQuotaFormRecId(null)}/>
                      </div>
                    </Card>
                  )}

                  {/* 한도 현황 테이블 */}
                  <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                      <thead>
                        <tr style={{background:G.sidebar,borderBottom:`1.5px solid ${G.border}`}}>
                          {["수취인명","사업자번호","서류 유형","승인 한도","사용액","처리 중","잔여 한도","상태","유효기간",""].map((h,i)=>(
                            <th key={i} style={{padding:"10px 12px",textAlign:"left",fontWeight:700,fontSize:10,color:G.textMid,whiteSpace:"nowrap"}}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {quotas.map((q,qi)=>{
                          const showInlineForm=quotaFormRecId===q.id;
                          return(
                            <>
                              <tr key={q.id} style={{borderBottom:`1px solid ${G.border}`,background:qi%2===0?G.white:"#FAFAFA"}}>
                                <td style={{padding:"12px 12px",fontWeight:600}}>{q.recipientName}</td>
                                <td style={{padding:"12px 12px",color:G.textMid}}>{q.registrationNo}</td>
                                <td style={{padding:"12px 12px"}}><span style={{background:"#F3F4F6",color:G.textMid,borderRadius:4,padding:"2px 7px",fontWeight:600,fontSize:10}}>{q.docType}</span></td>
                                <td style={{padding:"12px 12px",fontWeight:600}}>${q.totalApproved.toLocaleString()}</td>
                                <td style={{padding:"12px 12px",color:G.textMid}}>${q.usedAmount.toLocaleString()}</td>
                                <td style={{padding:"12px 12px",color:G.orange}}>${q.frozenAmount.toLocaleString()}</td>
                                <td style={{padding:"12px 12px"}}><QuotaBar total={q.totalApproved} used={q.usedAmount} frozen={q.frozenAmount}/></td>
                                <td style={{padding:"12px 12px"}}><CounterpartyStatusBadge status={q.status}/></td>
                                <td style={{padding:"12px 12px",color:G.textMid,fontSize:10,whiteSpace:"nowrap"}}>{q.validFrom||"—"}{q.validTo?` ~ ${q.validTo}`:""}</td>
                                <td style={{padding:"12px 12px"}}>
                                  <button onClick={()=>{if(quotaFormRecId===q.id){setQuotaFormRecId(null);}else{setQuotaFormRecId(q.id);setQuotaForm({docType:"Invoice",recipientId:q.recipientId,amount:"",validFrom:"",validTo:"",file:null});}}}
                                    style={{fontSize:10,padding:"4px 9px",borderRadius:5,border:`1px solid ${G.green}`,background:showInlineForm?G.greenLight:G.white,color:G.greenDark,cursor:"pointer",fontWeight:600,whiteSpace:"nowrap"}}>
                                    {showInlineForm?"접기":"추가 신청"}
                                  </button>
                                </td>
                              </tr>
                              {showInlineForm&&(
                                <tr key={`${q.id}-form`}>
                                  <td colSpan={10} style={{padding:0}}>
                                    <div style={{background:G.greenLight,borderBottom:`1px solid ${G.border}`,padding:"14px 16px"}}>
                                      <div style={{fontWeight:700,fontSize:11,color:G.greenDark,marginBottom:10}}>➕ {q.recipientName} — 추가 한도 신청</div>
                                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                                        <div style={{minWidth:120}}>
                                          <Lbl t="서류 유형*"/>
                                          <div style={{display:"flex",gap:6,marginBottom:10}}>
                                            {["Invoice","Contract"].map(dt=>(
                                              <button key={dt} onClick={()=>setQuotaForm(qf=>({...qf,docType:dt}))}
                                                style={{padding:"5px 10px",borderRadius:6,border:`1.5px solid ${quotaForm.docType===dt?G.green:G.border}`,background:quotaForm.docType===dt?G.white:G.white,fontWeight:quotaForm.docType===dt?700:400,cursor:"pointer",color:quotaForm.docType===dt?G.greenDark:G.textMid,fontSize:11}}>
                                                {dt}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                        <div style={{minWidth:140}}>
                                          <Lbl t="신청 금액 (USD)*"/>
                                          <Inp v={quotaForm.amount} set={v=>setQuotaForm(qf=>({...qf,amount:v}))} ph="금액 입력"/>
                                        </div>
                                        <div style={{minWidth:110}}>
                                          <Lbl t="유효 시작일"/>
                                          <Inp v={quotaForm.validFrom} set={v=>setQuotaForm(qf=>({...qf,validFrom:v}))} ph="yyyy-MM-dd"/>
                                        </div>
                                        <div style={{minWidth:110}}>
                                          <Lbl t="유효 종료일"/>
                                          <Inp v={quotaForm.validTo} set={v=>setQuotaForm(qf=>({...qf,validTo:v}))} ph="yyyy-MM-dd"/>
                                        </div>
                                        <div style={{minWidth:160}}>
                                          <Lbl t="서류 업로드*"/>
                                          <div style={{border:`1.5px dashed ${G.border}`,borderRadius:6,padding:"8px 10px",fontSize:10,color:G.textMid,cursor:"pointer",background:"#fff",marginBottom:10}}
                                            onClick={()=>document.getElementById(`qi-file-${q.id}`).click()}>
                                            {quotaForm.file?`📎 ${quotaForm.file}`:"파일 선택"}
                                            <input id={`qi-file-${q.id}`} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{display:"none"}}
                                              onChange={e=>{if(e.target.files[0])setQuotaForm(qf=>({...qf,file:e.target.files[0].name}));}}/>
                                          </div>
                                        </div>
                                      </div>
                                      <div style={{display:"flex",gap:7}}>
                                        <Btn t="신청 완료" sm onClick={()=>{
                                          if(!quotaForm.amount){T("⚠️ 금액을 입력하세요");return;}
                                          if(!quotaForm.file){T("⚠️ 서류를 업로드하세요");return;}
                                          const newQ={id:Date.now(),recipientId:q.recipientId,recipientName:q.recipientName,registrationNo:q.registrationNo,docType:quotaForm.docType,totalApproved:parseFloat(quotaForm.amount)||0,usedAmount:0,frozenAmount:0,status:"PENDING",validFrom:quotaForm.validFrom,validTo:quotaForm.validTo};
                                          setQuotas(qs=>[...qs,newQ]);setQuotaFormRecId(null);
                                          T("✅ 한도 신청이 제출되었습니다. 승인 후 해당 수취인으로 송금이 가능합니다.");
                                        }}/>
                                        <Btn t="취소" sm color={G.textLight} onClick={()=>setQuotaFormRecId(null)}/>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                    {quotas.length===0&&(
                      <div style={{textAlign:"center",padding:"40px 20px",color:G.textLight,fontSize:12}}>
                        신청된 한도가 없습니다.<br/>
                        <span style={{fontSize:11}}>+ 한도 신청 버튼으로 추가하세요.</span>
                      </div>
                    )}
                  </div>
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
  const [nc,setNc]=useState({name:"",email:"",mu:0.10});
  const [clientDeleteId,setClientDeleteId]=useState(null);
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

  const T=m=>{setToast(m);setTimeout(()=>setToast(null),2500);};
  useEffect(()=>{
    if(mpoCooldown<=0)return;
    const id=setInterval(()=>setMpoCooldown(s=>{if(s<=1){clearInterval(id);return 0;}return s-1;}),1000);
    return()=>clearInterval(id);
  },[mpoCooldown]);
  useEffect(()=>{
    if(mpoType!=="Crypto"||!mpoAmt||!mpoNet){setMpoGasFee(null);setMpoFeeLoading(false);setMpoFeeError(false);return;}
    setMpoFeeLoading(true);setMpoGasFee(null);setMpoFeeError(false);
    const GAS_FEE={"ERC-20":"3.50","Base":"0.05","TRC-20":"1.00"};
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
  const nav=[{g:"Overview",items:["Overview"]},{g:"Operations",items:["Transfer","Deposit","Convert","Payout"]},{g:"Management",items:["Clients","All Transfers","All Orders","Fee Settings"]}];
  const menuLabel={Overview:"Master Overview",Transfer:"Master Transfer",Deposit:"Deposit Instructions",Convert:"Convert",Payout:"Create Payout",Clients:"Sub Accounts",["All Transfers"]:"All Transfers",["All Orders"]:"All Orders",["Fee Settings"]:"Fee Settings"};

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
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                        <span style={{fontSize:11,color:G.textMid}}>환율 미리보기</span>
                        {mcvLoading
                          ?<span style={{fontSize:11,color:G.textLight}}>계산 중...</span>
                          :<span style={{fontSize:11,fontWeight:600}}>1 {mcvFrom} = 0.9998 {mcvTo}</span>
                        }
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                        <span style={{fontSize:11,color:G.textMid}}>수수료</span>
                        <div style={{textAlign:"right"}}>
                          {mcvLoading?<span style={{fontSize:11,color:G.textLight}}>계산 중...</span>:<>
                            <span style={{fontSize:11,fontWeight:700,color:G.orange}}>{feePct}% (총 {totalFeeAmt} {mcvFrom})</span>
                            <div style={{fontSize:9,color:G.textLight,marginTop:1}}>{feeDir}</div>
                          </>}
                        </div>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:8,borderTop:`1px solid ${G.border}`}}>
                        <span style={{fontSize:12,fontWeight:700}}>예상 수령액</span>
                        <div style={{display:"flex",alignItems:"center",gap:4}}>
                          {mcvLoading?<span style={{fontSize:14,color:G.textLight}}>계산 중...</span>:<>
                            <span style={{fontSize:16,fontWeight:700,color:G.greenDark}}>{received}</span>
                            <CIcon c={mcvTo} size={16}/><span style={{fontSize:12,fontWeight:600,color:G.greenDark}}>{mcvTo}</span>
                            {mcvToNet&&<NetBadge net={mcvToNet}/>}
                          </>}
                        </div>
                      </div>
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
            <div style={{maxWidth:440}}>
              <Card>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                  <div style={{fontWeight:700,fontSize:13}}>Create Payout</div>
                  <div style={{fontSize:10,background:G.greenLight,borderRadius:20,padding:"2px 9px",fontWeight:600,color:G.greenDark}}>Step 1 / 2</div>
                </div>
                <div style={{fontSize:11,color:G.textLight,marginBottom:14}}>송금 정보를 입력하세요.</div>
                <div style={{display:"flex",gap:7,marginBottom:12}}>
                  {["Fiat","Crypto"].map(tp=>(
                    <button key={tp} onClick={()=>{setMpoType(tp);setMpoCur(tp==="Fiat"?"USD":"USDC");setMpoNet("");setMpoRec("");}} style={{flex:1,padding:"9px",borderRadius:8,border:`2px solid ${mpoType===tp?G.green:G.border}`,background:mpoType===tp?G.greenLight:G.white,fontWeight:700,cursor:"pointer",color:mpoType===tp?G.greenDark:G.textMid,fontSize:12}}>{tp==="Fiat"?"🏦 Fiat (Bank)":"🔗 Crypto"}</button>
                  ))}
                </div>
                <Lbl t="수취인"/>
                <select value={mpoRec} onChange={e=>setMpoRec(e.target.value)} style={{width:"100%",padding:"8px 11px",borderRadius:7,border:`1px solid ${G.border}`,fontSize:12,marginBottom:10,background:G.white,boxSizing:"border-box"}}>
                  <option value="">— 수취인 선택 —</option>
                  {masterRecs.filter(r=>mpoType==="Fiat"?r.type==="Bank":r.type==="Crypto").map(r=>(
                    <option key={r.id} value={r.id}>{r.name} · {r.cur}{r.network?" ("+r.network+")":""}</option>
                  ))}
                </select>
                <Lbl t="통화"/><Sel v={mpoCur} set={v=>{setMpoCur(v);setMpoNet("");setMpoGasFee(null);}} opts={mpoType==="Fiat"?["USD","HKD"]:["USDC","USDT"]}/>
                {mpoType==="Crypto"&&<NetSelector cur={mpoCur} net={mpoNet} setNet={v=>{setMpoNet(v);setMpoGasFee(null);}}/>}
                <Lbl t="금액"/><Inp v={mpoAmt} set={v=>{setMpoAmt(v);setMpoGasFee(null);}} ph="숫자 입력"/>
                {(()=>{
                  const mpoAmtNum=parseFloat((mpoAmt||"0").replace(/,/g,""))||0;
                  const isLargeAmt=mpoAmtNum>=100000;
                  if(mpoType==="Fiat"&&mpoAmt){
                    const swiftFee=isLargeAmt?0:35;
                    return(
                      <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:10,padding:"14px 16px",marginBottom:12}}>
                        <div style={{fontSize:10,fontWeight:700,color:"#92400E",textTransform:"uppercase",marginBottom:10}}>출금 수수료</div>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                          <span style={{fontSize:11,color:G.textMid}}>네트워크</span><NetBadge net="SWIFT"/>
                        </div>
                        {isLargeAmt?(
                          <div style={{fontSize:11,color:G.orange,fontWeight:600,padding:"8px 0"}}>100,000 USD 이상 — 수수료 별도 문의</div>
                        ):(
                          <>
                            <div style={{display:"flex",justifyContent:"space-between",paddingBottom:8,borderBottom:"1px solid #FDE68A",marginBottom:8}}>
                              <span style={{fontSize:11,color:G.textMid}}>SWIFT 수수료</span>
                              <span style={{fontSize:11,fontWeight:700,color:G.orange}}>USD {swiftFee}.00</span>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                              <span style={{fontSize:10,color:G.textMid}}>송금 요청액</span>
                              <span style={{fontSize:10,fontWeight:600}}>{mpoAmtNum.toLocaleString("en-US",{minimumFractionDigits:2})} {mpoCur}</span>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between",background:G.greenLight,borderRadius:6,padding:"6px 10px",marginTop:4}}>
                              <span style={{fontSize:11,fontWeight:700,color:G.textDark}}>총 차감액</span>
                              <span style={{fontSize:14,fontWeight:700,color:G.textDark}}>{(mpoAmtNum+swiftFee).toLocaleString("en-US",{minimumFractionDigits:2})} {mpoCur}</span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  }
                  if(mpoType==="Crypto"&&mpoAmt&&mpoNet){
                    return(
                      <div style={{background:mpoFeeLoading?G.sidebar:"#FFFBEB",border:`1px solid ${mpoFeeLoading?G.border:"#FDE68A"}`,borderRadius:10,padding:"14px 16px",marginBottom:12}}>
                        <div style={{fontSize:10,fontWeight:700,color:"#92400E",textTransform:"uppercase",marginBottom:10}}>네트워크 가스비</div>
                        {mpoFeeError?(
                          <div style={{fontSize:11,color:G.red}}>가스비 조회 실패. 잠시 후 다시 시도하세요.</div>
                        ):mpoFeeLoading?(
                          <div style={{display:"flex",alignItems:"center",gap:8,color:G.textMid,fontSize:11}}>
                            <span style={{display:"inline-block",width:14,height:14,border:"2px solid #ccc",borderTopColor:G.green,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
                            가스비 조회 중...
                          </div>
                        ):(
                          <>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                              <span style={{fontSize:10,color:G.textMid}}>송금 요청액</span>
                              <span style={{fontSize:11,fontWeight:600}}>{mpoAmtNum.toLocaleString("en-US",{minimumFractionDigits:2})} {mpoCur}</span>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between",paddingBottom:6,borderBottom:"1px solid #FDE68A",marginBottom:6}}>
                              <span style={{fontSize:10,color:G.textMid}}>예상 가스비</span>
                              <span style={{fontSize:11,fontWeight:700,color:G.orange}}>+ {mpoGasFee} {mpoCur}</span>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between",background:G.greenLight,borderRadius:6,padding:"6px 10px"}}>
                              <span style={{fontSize:11,fontWeight:700,color:G.textDark}}>예상 총 차감액</span>
                              <span style={{fontSize:14,fontWeight:700,color:G.textDark}}>{(mpoAmtNum+parseFloat(mpoGasFee||0)).toFixed(2)} {mpoCur}</span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  }
                  return null;
                })()}
                <button
                  disabled={!mpoRec||!mpoAmt||(mpoType==="Crypto"&&(!mpoNet||mpoFeeLoading||!mpoGasFee||mpoFeeError))}
                  onClick={()=>{
                    if(!mpoRec||!mpoAmt){T("⚠️ 수취인/금액 입력");return;}
                    if(mpoType==="Crypto"&&!mpoNet){T("⚠️ 네트워크를 선택하세요");return;}
                    if(mpoType==="Crypto"&&(!mpoGasFee||mpoFeeError)){T("⚠️ 가스비 로딩 완료 후 진행하세요");return;}
                    setShowMpoOtp(true);setMpoOtp(["","","","","",""]);setMpoOtpFail(0);setMpoCooldown(0);setMpoSubmitting(false);
                  }}
                  style={{width:"100%",padding:"11px",borderRadius:8,border:"none",fontWeight:700,fontSize:13,cursor:(!mpoRec||!mpoAmt||(mpoType==="Crypto"&&(!mpoNet||mpoFeeLoading||!mpoGasFee||mpoFeeError)))?"not-allowed":"pointer",background:(!mpoRec||!mpoAmt||(mpoType==="Crypto"&&(!mpoNet||mpoFeeLoading||!mpoGasFee||mpoFeeError)))?"#ccc":G.green,color:(!mpoRec||!mpoAmt||(mpoType==="Crypto"&&(!mpoNet||mpoFeeLoading||!mpoGasFee||mpoFeeError)))?G.textLight:"#fff",transition:"background 0.15s"}}>
                  다음 — OTP 인증으로 →
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
                    const fee=mpoType==="Fiat"?`+ 35.00 ${mpoCur}`:`+ ${mpoGasFee||"0.05"} ${mpoCur}`;
                    const total=mpoType==="Fiat"?`${(amtN+35).toLocaleString("en-US",{minimumFractionDigits:2})} ${mpoCur}`:`${(amtN+parseFloat(mpoGasFee||"0.05")).toFixed(2)} ${mpoCur}`;
                    return [["수취인",mpoRecName],[`금액`,`${amtN.toLocaleString("en-US",{minimumFractionDigits:2})} ${mpoCur}`],["수수료",fee],["총 차감액",total],["네트워크",mpoNetDisplay]].map(([k,v])=>(
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

          {menu==="Clients"&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontWeight:700,fontSize:13}}>Sub Accounts ({clients.length})</div>
                <Btn t="+ New Client" sm onClick={()=>setShowCreate(v=>!v)}/>
              </div>
              {showCreate&&(
                <Card style={{marginBottom:14,border:`1.5px solid ${G.green}`}}>
                  <div style={{fontWeight:700,fontSize:12,marginBottom:12,color:G.greenDark}}>New Client</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                    <div><Lbl t="Company Name*"/><Inp v={nc.name} set={v=>setNc(c=>({...c,name:v}))} ph="e.g. GlobalPay"/></div>
                    <div><Lbl t="Admin Email*"/><Inp v={nc.email} set={v=>setNc(c=>({...c,email:v}))} ph="admin@company.com"/></div>
                    <div>
                      <Lbl t="Convert Markup (%)"/>
                      <input type="number" value={nc.mu*100} onChange={e=>setNc(c=>({...c,mu:parseFloat(e.target.value)/100}))} step="0.01"
                        style={{width:"100%",padding:"8px 11px",borderRadius:7,border:`1px solid ${G.border}`,fontSize:12,boxSizing:"border-box",marginBottom:10}}/>
                    </div>
                  </div>
                  <div style={{background:G.blueLight,border:"1px solid #BEE3F8",borderRadius:7,padding:"9px 12px",fontSize:10,color:"#2B6CB0",marginBottom:8}}>
                    📧 저장 시 <b>{nc.email||"입력된 이메일"}</b>로 임시 비밀번호 자동 발송
                  </div>
                  <div style={{background:"#FFF7ED",border:"1px solid #FED7AA",borderRadius:7,padding:"8px 12px",fontSize:10,color:"#92400E",marginBottom:10}}>
                    ⚠️ 생성 직후 KYB 상태: INACTIVE. KYB 제출 전까지 해당 Sub Account는 Payout/Convert 불가.
                  </div>
                  <Btn t="계정 생성 및 초대 이메일 발송" sm onClick={()=>{
                    if(!nc.name||!nc.email){T("⚠️ 이름/이메일 입력");return;}
                    setClients(cs=>[...cs,{id:"SUB-00"+(cs.length+1),name:nc.name,email:nc.email,st:"Active",created:new Date().toISOString().split("T")[0],mu:nc.mu,muOn:nc.mu,muOff:nc.mu,otpReq:false,locked:false,kybStatus:"INACTIVE"}]);
                    setNc({name:"",email:"",mu:0.10});setShowCreate(false);
                    T(`✅ "${nc.name}" 계정 생성 + 초대 이메일 발송!`);
                  }}/>
                </Card>
              )}
              <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:10,overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead>
                    <tr style={{background:G.sidebar}}>
                      {["ID","Company","Email","Status","KYB","Created","Markup","Actions"].map(h=>(
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
                          {editMu===c.id?(
                            <div style={{display:"flex",alignItems:"center",gap:4}}>
                              <input type="number" defaultValue={(c.mu*100).toFixed(2)} id={`mu-${c.id}`} step="0.01"
                                style={{width:58,padding:"4px 6px",borderRadius:6,border:`1.5px solid ${G.green}`,fontSize:11,outline:"none",textAlign:"right"}}/>
                              <span style={{fontSize:10,color:G.textMid}}>%</span>
                              <Btn t="저장" sm color={G.green} onClick={()=>{
                                const val=parseFloat(document.getElementById(`mu-${c.id}`).value)/100;
                                setClients(cs=>cs.map(x=>x.id===c.id?{...x,mu:val}:x));setEditMu(null);T(`✅ ${c.name} markup updated`);
                              }}/>
                              <Btn t="취소" sm color={G.textLight} onClick={()=>setEditMu(null)}/>
                            </div>
                          ):(
                            <div style={{display:"flex",alignItems:"center",gap:6}}>
                              <span style={{background:G.greenLight,color:G.greenDark,borderRadius:6,padding:"3px 10px",fontWeight:700,fontSize:11,cursor:"default",position:"relative"}}
                                title={`최종 수수료 = OSL 0.02% + ${(c.mu*100).toFixed(2)}% = ${(0.02+c.mu*100).toFixed(2)}%`}>
                                +{(c.mu*100).toFixed(2)}%
                              </span>
                              <button onClick={()=>setEditMu(c.id)} style={{fontSize:10,padding:"3px 9px",borderRadius:5,border:`1px solid ${G.border}`,background:G.white,cursor:"pointer",color:G.textMid,fontWeight:600}}>수정</button>
                            </div>
                          )}
                        </td>
                        <td style={{padding:"10px 11px"}}>
                          <div style={{display:"flex",gap:4,flexWrap:"wrap",minWidth:180}}>
                            {/* KYB 등록 (INACTIVE 또는 REJECTED) */}
                            {(c.kybStatus==="INACTIVE"||c.kybStatus==="REJECTED")&&(
                              <button onClick={()=>T(`📋 ${c.name} KYB 등록 화면으로 이동 (SCR-21)`)}
                                style={{fontSize:9,padding:"3px 7px",borderRadius:3,border:"1px solid #7C3AED",background:"#F3E8FF",color:"#7C3AED",cursor:"pointer",fontWeight:600,whiteSpace:"nowrap"}}>KYB 등록</button>
                            )}
                            {/* KYB 재제출 (REJECTED만) */}
                            {c.kybStatus==="REJECTED"&&(
                              <button onClick={()=>T(`⚠️ ${c.name} KYB 재제출 (REJECTED 사유 확인 필요)`)}
                                style={{fontSize:9,padding:"3px 7px",borderRadius:3,border:"1px solid #991B1B",background:"#FEE2E2",color:"#991B1B",cursor:"pointer",fontWeight:600,whiteSpace:"nowrap"}}>KYB 재제출</button>
                            )}
                            {/* OTP 재발송 */}
                            {c.otpReq&&(
                              <button onClick={()=>{setClients(cs=>cs.map(x=>x.id===c.id?{...x,otpReq:false}:x));T(`📧 ${c.name} OTP 재발송 완료`);}}
                                style={{fontSize:9,padding:"3px 7px",borderRadius:3,border:"1px solid #6366F1",background:"#EEF2FF",color:"#6366F1",cursor:"pointer",fontWeight:600,whiteSpace:"nowrap"}}>OTP 재발송</button>
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
                <Btn t="📥 Export" sm onClick={()=>exportCSV(TX_DATA,[{l:"TX ID",k:"id"},{l:"Date",k:"date"},{l:"Account",k:"acct"},{l:"Type",k:"type"},{l:"Recipient",k:"recipientName"},{l:"From Cur",k:"fromCur"},{l:"From Amt",k:"fromAmt"},{l:"To Cur",k:"cur"},{l:"To Amt",k:"amt"},{l:"Network",k:"network"},{l:"TXID",k:"txid"},{l:"Status",k:"st"}],"all_orders.csv")}/>
              </div>
              <TxTable rows={TX_DATA} showAcct={true} onSelect={setSelectedTx}/>
            </div>
          )}

          {menu==="Fee Settings"&&(
            <div style={{maxWidth:640}}>
              <Card>
                <div style={{fontWeight:700,fontSize:13,marginBottom:4}}>Convert 수수료 설정</div>
                <div style={{fontSize:11,color:G.textLight,marginBottom:14}}>Sub Account 화면에는 합산 수수료만 표시됩니다. OSL/IB 내역 미노출.</div>
                <div style={{background:"#F8F8F8",borderRadius:8,overflow:"hidden",border:`1px solid ${G.border}`}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                    <thead>
                      <tr style={{background:"#EFEFED"}}>
                        <th style={{padding:"10px 14px",textAlign:"left",fontWeight:700,color:G.textMid,borderBottom:`1px solid ${G.border}`,width:110}}></th>
                        <th style={{padding:"10px 14px",textAlign:"center",fontWeight:700,color:G.textDark,borderBottom:`1px solid ${G.border}`}}>On-ramp<br/><span style={{fontSize:9,fontWeight:400,color:G.textMid}}>Fiat → Crypto</span></th>
                        <th style={{padding:"10px 14px",textAlign:"center",fontWeight:700,color:G.textDark,borderBottom:`1px solid ${G.border}`}}>Off-ramp<br/><span style={{fontSize:9,fontWeight:400,color:G.textMid}}>Crypto → Fiat</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{background:"#FAFAFA",borderBottom:`1px solid ${G.border}`}}>
                        <td style={{padding:"10px 14px",fontWeight:700,color:G.textMid}}>OSL 도매가</td>
                        <td style={{padding:"10px 14px",textAlign:"center"}}><span style={{background:"#EBEBEB",borderRadius:6,padding:"4px 12px",fontWeight:700,fontSize:11,color:G.textMid}}>0% (고정)</span></td>
                        <td style={{padding:"10px 14px",textAlign:"center"}}><span style={{background:"#EBEBEB",borderRadius:6,padding:"4px 12px",fontWeight:700,fontSize:11,color:G.textMid}}>0.2% (고정)</span></td>
                      </tr>
                      {clients.filter(c=>c.st==="Active").map((c,i,arr)=>(
                        <ConvertFeeRow key={c.id} c={c} isLast={i===arr.length-1}
                          editState={editFee?.id===c.id?editFee.dir:null}
                          onEdit={dir=>setEditFee(dir?{id:c.id,dir}:null)}
                          onSave={(dir,val)=>{setClients(cs=>cs.map(x=>x.id===c.id?{...x,[dir==='on'?'muOn':'muOff']:parseFloat(val)/100}:x));setEditFee(null);T(`✅ ${c.name} ${dir==='on'?'On-ramp':'Off-ramp'} markup updated`);}}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
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