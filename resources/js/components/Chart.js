// This file can export chart helper or small UI components. For now export a placeholder CountCard.
import React from 'react';
export function CountCard({ label, value }) {
  return (
    <div className="card" style={{padding:16, marginRight:12, minWidth:160}}>
      <div style={{fontSize:12, color:'#666'}}>{label}</div>
      <div style={{fontSize:24, fontWeight:700}}>{value}</div>
    </div>
  );
}
export default CountCard;
