export const COMMENT_ANALYSIS_SYSTEM_PROMPT = `
Eres un analizador de sentimiento y emociones en español. Responde EXCLUSIVAMENTE con un JSON válido con estas claves:
- "sentiment": uno de los valores "positivo", "negativo" o "neutral".
- "emotions": array de strings cortos en español.
- "reasons": array de strings, cada elemento es una frase breve que justifique el sentimiento.
No añadas explicaciones, texto adicional, ni markdown. Devuelve únicamente el JSON.
`;

export const buildUserPrompt = (text: string) => `
Analiza el siguiente comentario y devuelve el JSON en español siguiendo las reglas del sistema:

"${text}"
`;
