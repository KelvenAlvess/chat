import React from 'react';

function App() {
    return (
        <div className="flex flex-col h-screen bg-gray-100 font-sans">
            {/* Cabeçalho */}
            <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
                <h1 className="text-xl font-bold">Chat em Tempo Real</h1>
                <span className="bg-green-400 text-blue-900 text-xs font-bold px-2 py-1 rounded-full">
          Conectado
        </span>
            </header>

            {/* Área de Mensagens */}
            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Exemplo de mensagem recebida */}
                <div className="flex items-start">
                    <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[70%]">
                        <span className="text-xs text-gray-500 font-semibold block mb-1">Usuário Teste</span>
                        <p className="text-gray-800">Olá! Esta é uma mensagem de teste para ver o Tailwind em ação.</p>
                    </div>
                </div>

                {/* Exemplo de mensagem enviada (Minha mensagem) */}
                <div className="flex items-start justify-end">
                    <div className="bg-blue-100 p-3 rounded-lg rounded-tr-none shadow-sm max-w-[70%]">
                        <span className="text-xs text-blue-500 font-semibold block mb-1 text-right">Você</span>
                        <p className="text-gray-800">Incrível! O ambiente está configurado perfeitamente.</p>
                    </div>
                </div>
            </main>

            {/* Input de Mensagem */}
            <footer className="bg-white p-4 border-t border-gray-200">
                <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Digite sua mensagem..."
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                    >
                        Enviar
                    </button>
                </form>
            </footer>
        </div>
    );
}

export default App;