import { useMemo, useState } from 'react';
import './styles.css';

const GATES = {
  AND: { label: 'AND', description: 'Both signals must be high', expression: 'A · B', accent: 'coral' },
  OR: { label: 'OR', description: 'Either signal can be high', expression: 'A + B', accent: 'yellow' },
  XOR: { label: 'XOR', description: 'Exactly one signal is high', expression: 'A ⊕ B', accent: 'mint' },
  NAND: { label: 'NAND', description: 'The inverse of AND', expression: '¬(A · B)', accent: 'blue' },
  NOR: { label: 'NOR', description: 'Neither signal is high', expression: '¬(A + B)', accent: 'violet' },
};

function evaluateGate(gate, a, b) {
  if (gate === 'AND') return a && b;
  if (gate === 'OR') return a || b;
  if (gate === 'XOR') return a !== b;
  if (gate === 'NAND') return !(a && b);
  return !(a || b);
}

function Signal({ name, value, onToggle }) {
  return (
    <button className={`signal signal-${value ? 'on' : 'off'}`} onClick={onToggle} aria-pressed={value}>
      <span className="signal-head"><span className="signal-dot" />{name}</span>
      <strong>{value ? 'HIGH' : 'LOW'}</strong>
      <span className="signal-hint">click to toggle</span>
    </button>
  );
}

function GateSymbol({ gate, output }) {
  return (
    <div className={`gate-symbol gate-${GATES[gate].accent}`}>
      <span className="gate-caption">{GATES[gate].expression}</span>
      <div className="gate-body">
        <span className="gate-mark">{gate}</span>
        <span className="gate-input input-a" />
        <span className="gate-input input-b" />
        <span className="gate-output" />
      </div>
      <span className="gate-output-label">Q = {output ? '1' : '0'}</span>
    </div>
  );
}

function App() {
  const [gate, setGate] = useState('AND');
  const [inputs, setInputs] = useState({ a: true, b: false });
  const currentGate = GATES[gate];
  const output = evaluateGate(gate, inputs.a, inputs.b);
  const truthRows = useMemo(() => [
    [false, false], [false, true], [true, false], [true, true],
  ].map(([a, b]) => ({ a, b, output: evaluateGate(gate, a, b) })), [gate]);

  const toggleInput = (key) => setInputs((previous) => ({ ...previous, [key]: !previous[key] }));

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-glyph">n</span><span>neo / logic lab</span></div>
        <div className="status"><span className="status-light" />SIMULATION LIVE <span className="status-divider" /> v0.1 POC</div>
      </header>

      <section className="intro">
        <div>
          <p className="eyebrow">DIGITAL LOGIC / INTERACTIVE EXPLORER</p>
          <h1>Make a signal.<br /><em>See the logic.</em></h1>
          <p className="intro-copy">Flip the inputs and watch the gate resolve in real time. A small, tactile way to understand the rules behind every digital system.</p>
        </div>
        <div className="intro-note"><span>01</span><p>Choose a gate<br />to begin</p></div>
      </section>

      <section className="workspace">
        <aside className="gate-panel panel">
          <div className="panel-kicker"><span>GATE LIBRARY</span><span>05 TYPES</span></div>
          <div className="gate-list">
            {Object.entries(GATES).map(([key, item]) => (
              <button key={key} className={`gate-option ${gate === key ? 'selected' : ''}`} onClick={() => setGate(key)}>
                <span className={`gate-icon icon-${item.accent}`}>{key === 'XOR' ? '⊻' : key === 'NAND' ? '∧̅' : key === 'NOR' ? '∨̅' : key === 'AND' ? '∧' : '∨'}</span>
                <span><strong>{item.label}</strong><small>{item.description}</small></span>
                <span className="arrow">↗</span>
              </button>
            ))}
          </div>
          <div className="tip"><span className="tip-icon">i</span><span><strong>Logic tip</strong>Every gate takes two binary inputs and produces one binary output.</span></div>
        </aside>

        <section className="simulator panel">
          <div className="simulator-head"><div><span className="panel-kicker">LIVE CIRCUIT</span><h2>{currentGate.label} gate</h2></div><span className={`output-pill ${output ? 'is-high' : ''}`}><span />OUTPUT {output ? 'HIGH' : 'LOW'}</span></div>
          <div className="circuit-board">
            <div className="input-stack"><Signal name="INPUT A" value={inputs.a} onToggle={() => toggleInput('a')} /><Signal name="INPUT B" value={inputs.b} onToggle={() => toggleInput('b')} /></div>
            <div className="wire-cluster"><span className={`wire wire-a ${inputs.a ? 'active' : ''}`} /><span className={`wire wire-b ${inputs.b ? 'active' : ''}`} /></div>
            <GateSymbol gate={gate} output={output} />
            <div className={`output-node ${output ? 'active' : ''}`}><span className="output-orb" /><strong>OUTPUT Q</strong><small>{output ? '1 / HIGH' : '0 / LOW'}</small></div>
          </div>
          <div className="readout"><span className="readout-label">CURRENT EXPRESSION</span><strong>{currentGate.expression}</strong><span className="equals">=</span><strong className={output ? 'result-high' : ''}>{output ? '1' : '0'}</strong><span className="readout-description">{currentGate.description}</span></div>
        </section>
      </section>

      <section className="truth-section panel">
        <div className="truth-heading"><div><span className="panel-kicker">REFERENCE TABLE</span><h2>Truth table <span>/ {currentGate.label}</span></h2></div><p>All possible input combinations</p></div>
        <div className="table-wrap"><table><thead><tr><th>INPUT A</th><th>INPUT B</th><th>OUTPUT Q</th><th>READS AS</th></tr></thead><tbody>{truthRows.map((row) => <tr key={`${row.a}-${row.b}`} className={row.a === inputs.a && row.b === inputs.b ? 'current-row' : ''}><td><span className={`bit ${row.a ? 'bit-on' : ''}`}>{row.a ? '1' : '0'}</span></td><td><span className={`bit ${row.b ? 'bit-on' : ''}`}>{row.b ? '1' : '0'}</span></td><td><span className={`bit output-bit ${row.output ? 'bit-on' : ''}`}>{row.output ? '1' : '0'}</span></td><td>{row.output ? 'Signal passes' : 'Signal blocked'}{row.a === inputs.a && row.b === inputs.b && <span className="now">NOW</span>}</td></tr>)}</tbody></table></div>
      </section>

      <footer><span>NEO LOGIC LAB</span><span>Binary is the beginning of everything.</span><span>BUILT FOR CURIOSITY ↗</span></footer>
    </main>
  );
}

export default App;
