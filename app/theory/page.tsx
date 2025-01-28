import Link from 'next/link'

export default function TheoryPage() {
  return (
    <div className="flex flex-col items-center p-8 mx-auto w-1/2">
      <h1 className="text-2xl font-bold mb-4">Teoria do Passeio do Cavalo</h1>
      <p className="text-gray-600 mb-4">
        O Passeio do Cavalo é um problema matemático clássico relacionado ao
        xadrez, onde o objetivo é mover um cavalo em um tabuleiro vazio de forma
        que ele visite todas as casas exatamente uma vez.
      </p>
      <p className="text-gray-600 mb-4">
        Esse problema tem soluções para tabuleiros de vários tamanhos, e há
        diferentes estratégias para resolvê-lo, incluindo heurísticas como a
        regra de Warnsdorff e abordagens de backtracking.
      </p>
      <p className="text-gray-600 mb-4">
        A regra de Warnsdorff sugere sempre escolher o próximo movimento que
        leve o cavalo para a casa com o menor número de movimentos possíveis.
        Essa abordagem ajuda a evitar situações onde o cavalo fique
        &quot;preso&quot; antes de preencher o tabuleiro.
      </p>
      <span className="text-gray-600 mb-4">
        Fonte:{' '}
        <a
          href="https://en.wikipedia.org/wiki/Knight%27s_tour"
          target="_blank"
          rel="noreferrer"
          className="underline text-blue-500"
        >
          Wikipedia
        </a>
      </span>
      <Link
        href="/"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Voltar ao Jogo
      </Link>
    </div>
  )
}
