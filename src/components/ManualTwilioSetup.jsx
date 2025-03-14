import React from "react";

export default function ManualTwilioSetup() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Como Configurar seu WhatsApp</h1>

      <p className="mb-2">
        Siga este passo a passo simples para cadastrar seu número e integrar ao
        nosso sistema.
      </p>

      <ol className="list-decimal list-inside space-y-2">
        <li>
          <strong>Use um número “limpo”:</strong> Ele não pode estar conectado
          ao WhatsApp comum ou WhatsApp Business App. Se já estiver, você
          precisa desconectar/deletar a conta no app antes de prosseguir.
        </li>
        <li>
          <strong>Ative seu Chip:</strong> Certifique-se de que consegue receber
          SMS ou ligações nesse número.
        </li>
        <li>
          <strong>Acesse a página de Configuração no nosso app:</strong> Lá,
          você vai inserir o número (no formato internacional, ex.:{" "}
          <code>+5511999999999</code>) e clicar em{" "}
          <em>“Iniciar Verificação WhatsApp”</em>.
        </li>
        <li>
          <strong>Receba o Código:</strong> Você receberá um SMS ou ligação no
          seu chip com um código de verificação. Digite esse código na página de
          configuração e confirme.
        </li>
        <li>
          <strong>Pronto!</strong> Se o número for verificado com sucesso, o
          nosso sistema vai integrar automaticamente o seu número ao Twilio para
          envio e recebimento de mensagens via WhatsApp.
        </li>
      </ol>

      <hr className="my-4" />

      <h2 className="text-xl font-semibold mb-2">Dicas Importantes</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>
          Você perderá acesso ao WhatsApp comum nesse chip, pois ele estará
          conectado à API do WhatsApp Business.
        </li>
        <li>
          Se a verificação não funcionar (status <code>failed</code> ou
          <code>pending</code>), pode ser que seu número ainda esteja registrado
          no WhatsApp comum ou que o código inserido esteja errado.
        </li>
        <li>
          Após verificado, suas mensagens poderão ser enviadas/recebidas
          diretamente no nosso sistema, sem precisar do app do WhatsApp.
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
