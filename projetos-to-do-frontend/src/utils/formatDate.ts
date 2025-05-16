export function formatarDataBR(dataString: string) {
if (!dataString.includes("T")) return "Data inválida";

const [data, hora] = dataString.split("T");
const [ano, mes, dia] = data.split("-");

return `${dia}/${mes}/${ano} às ${hora.slice(0, 5)}`;
}