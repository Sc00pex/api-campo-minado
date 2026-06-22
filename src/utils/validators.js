function validarRequisitosSenha(senha) {
  const erros = [];
  if (typeof senha !== 'string' || senha.length < 8) erros.push('no mínimo 8 caracteres');
  if (!/[A-Z]/.test(senha)) erros.push('pelo menos uma letra maiúscula');
  if (!/[0-9]/.test(senha)) erros.push('pelo menos um número');
  if (!/[^A-Za-z0-9]/.test(senha)) erros.push('pelo menos um caractere especial');
  return erros;
}

function emailValido(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function dataValida(data) {
  if (typeof data !== 'string') return false;
  const d = new Date(data);
  return !Number.isNaN(d.getTime());
}

function saldoValido(valor) {
  if (typeof valor !== 'number' || !Number.isFinite(valor)) return false;
  if (valor < 0) return false;
  const centavos = valor * 100;
  return Math.abs(centavos - Math.round(centavos)) < 1e-9;
}

module.exports = { validarRequisitosSenha, emailValido, dataValida, saldoValido };
