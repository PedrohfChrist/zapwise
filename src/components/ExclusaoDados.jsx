import { Link } from "react-router-dom";
import React from "react";

export default function ExclusaoDados() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Como Excluir Seus Dados do App
      </h1>

      <p className="mb-2">
        Siga este passo a passo simples para remover seu número do nosso
        sistema.
      </p>

      <ol className="list-decimal list-inside space-y-2">
        <li>
          <strong>Acesse a aba "Configurações":</strong>{" "}
          <Link to="/config"> Clique aqui </Link>
        </li>
        <li>
          <strong>Clique em "Remover Número":</strong> Isso irá remover seus
          dados no nosso sistema.
        </li>
        <li>
          <strong>Conclua a Remoção:</strong> Após a remoção ser consluída,
          verifique novamente se seus número sumiu da aba "Configurações"
        </li>
        <li>
          <strong>Tudo Pronto!</strong> Seus dados pessoais foram removidos do
          sistema.
        </li>
      </ol>

      <hr className="my-4" />

      <h2 className="text-xl font-semibold mb-2">Dicas Importantes</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>
          Você perderá o uso destes dados no nosso app até serem adicionados
          novamente.
        </li>
        <li>
          Se a remoção for completa, nenhuma informação deve aparecer em
          "Configurações"
        </li>
  
      </ul>

      <hr className="my-4" />

      <p className="mt-4">
        Se tiver qualquer dúvida ou problema, entre em contato com o nosso
        suporte. Estamos aqui para ajudar!
      </p>
    </div>
  );
}
