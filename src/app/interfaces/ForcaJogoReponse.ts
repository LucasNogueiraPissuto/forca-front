export interface ForcaJogoResponse {
  gameId: number;           
  palavraSecreta: string;   
  wordId: string;
  palavraMascarada: string;
  dicas: string[];          
  palpites: string[];       
  maxErrors: number;        
  email: string;           
  status: string;           
  mensagem: string;         
}