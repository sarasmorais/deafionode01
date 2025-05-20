"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { BookOpen, Plus, Trash2 } from "lucide-react"

export default function Home() {
  const [books, setBooks] = useState([])
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [loading, setLoading] = useState(true)

  // URL da API
  const API_URL = "/api/books"

  // Carregar livros quando a página carregar
  useEffect(() => {
    fetchBooks()
  }, [])

  // Função para buscar livros da API
  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await fetch(API_URL)
      const data = await response.json()
      setBooks(data)
      setLoading(false)
    } catch (error) {
      console.error("Erro ao buscar livros:", error)
      setLoading(false)
    }
  }

  // Função para adicionar um novo livro
  const addBook = async (e) => {
    e.preventDefault()

    if (!title || !author) return

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, author }),
      })

      if (response.ok) {
        // Limpar o formulário
        setTitle("")
        setAuthor("")
        // Atualizar a lista de livros
        fetchBooks()
      }
    } catch (error) {
      console.error("Erro ao adicionar livro:", error)
    }
  }

  // Função para remover um livro
  const removeBook = async (index) => {
    try {
      const response = await fetch(`${API_URL}?index=${index}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Atualizar a lista de livros
        fetchBooks()
      }
    } catch (error) {
      console.error("Erro ao remover livro:", error)
    }
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-10">Minha Biblioteca Virtual</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulário para adicionar livros */}
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Novo Livro</CardTitle>
            <CardDescription>Preencha os detalhes do livro que deseja adicionar à biblioteca</CardDescription>
          </CardHeader>
          <form onSubmit={addBook}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Digite o título do livro"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Autor</Label>
                <Input
                  id="author"
                  placeholder="Digite o nome do autor"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Adicionar Livro
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Lista de livros */}
        <Card>
          <CardHeader>
            <CardTitle>Meus Livros</CardTitle>
            <CardDescription>Livros adicionados à sua biblioteca</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-4">Carregando livros...</p>
            ) : books.length === 0 ? (
              <p className="text-center py-4">Nenhum livro adicionado ainda</p>
            ) : (
              <ul className="space-y-3">
                {books.map((book, index) => (
                  <li key={index} className="flex items-start p-3 border rounded-md">
                    <BookOpen className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">{book.title}</p>
                      <p className="text-sm text-gray-500">por {book.author}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeBook(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
