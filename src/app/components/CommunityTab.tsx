"use client"

import { useState, useRef } from "react"
import { Heart, MessageCircle, Award, Image as ImageIcon, Send, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
}

interface Post {
  id: string
  author: {
    name: string
    avatar: string
    level: string
  }
  content: string
  image?: string
  likes: number
  comments: Comment[]
  timestamp: string
  liked: boolean
  showComments: boolean
}

export default function CommunityTab() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: {
        name: "Carlos Silva",
        avatar: "",
        level: "Avançado"
      },
      content: "Finalizei meu treino de pernas hoje! 💪 Consegui aumentar 5kg no agachamento. A consistência está valendo a pena!",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop",
      likes: 42,
      comments: [
        {
          id: "c1",
          author: "Marina Costa",
          content: "Parabéns! Continue assim! 🔥",
          timestamp: "há 1 hora"
        }
      ],
      timestamp: "há 2 horas",
      liked: false,
      showComments: false
    },
    {
      id: "2",
      author: {
        name: "Marina Costa",
        avatar: "",
        level: "Intermediário"
      },
      content: "Dica do dia: Não esqueçam de se hidratar durante o treino! Faz toda diferença no desempenho 💧",
      likes: 28,
      comments: [],
      timestamp: "há 4 horas",
      liked: true,
      showComments: false
    },
    {
      id: "3",
      author: {
        name: "Pedro Oliveira",
        avatar: "",
        level: "Iniciante"
      },
      content: "Primeira semana completa de treinos! Obrigado pela motivação pessoal 🔥",
      likes: 67,
      comments: [],
      timestamp: "há 6 horas",
      liked: false,
      showComments: false
    }
  ])

  const [newPost, setNewPost] = useState("")
  const [newPostImage, setNewPostImage] = useState<string | null>(null)
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        }
      }
      return post
    }))
  }

  const toggleComments = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          showComments: !post.showComments
        }
      }
      return post
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewPostImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setNewPostImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const createPost = () => {
    if (!newPost.trim()) return

    const signupData = localStorage.getItem("fitmode_signup_data")
    let userName = "Usuário"
    
    if (signupData) {
      const signup = JSON.parse(signupData)
      userName = signup.name || "Usuário"
    }

    const post: Post = {
      id: Date.now().toString(),
      author: {
        name: userName,
        avatar: "",
        level: "Iniciante"
      },
      content: newPost,
      image: newPostImage || undefined,
      likes: 0,
      comments: [],
      timestamp: "agora",
      liked: false,
      showComments: false
    }

    setPosts([post, ...posts])
    setNewPost("")
    setNewPostImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const addComment = (postId: string) => {
    const commentText = commentTexts[postId]
    if (!commentText?.trim()) return

    const signupData = localStorage.getItem("fitmode_signup_data")
    let userName = "Usuário"
    
    if (signupData) {
      const signup = JSON.parse(signupData)
      userName = signup.name || "Usuário"
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      author: userName,
      content: commentText,
      timestamp: "agora"
    }

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        }
      }
      return post
    }))

    setCommentTexts({ ...commentTexts, [postId]: "" })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">Comunidade</h2>
        <p className="text-gray-400">Compartilhe sua jornada e inspire outros</p>
      </div>

      {/* Monthly Challenge Banner */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 border-none p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white">Desafio de Dezembro</h3>
            <p className="text-sm text-white/80">20 Treinos • 1.247 participantes</p>
          </div>
          <Button variant="secondary" size="sm" className="bg-white text-blue-600 hover:bg-white/90">
            Participar
          </Button>
        </div>
      </Card>

      {/* Create Post */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-blue-500 text-white">EU</AvatarFallback>
            </Avatar>
            <Textarea
              placeholder="Compartilhe seu progresso, dicas ou motivação..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="flex-1 bg-black/50 border-white/10 text-white resize-none"
              rows={3}
            />
          </div>

          {/* Image Preview */}
          {newPostImage && (
            <div className="relative rounded-lg overflow-hidden">
              <img src={newPostImage} alt="Preview" className="w-full h-48 object-cover" />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 hover:text-white hover:bg-white/5"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Adicionar Foto
              </Button>
            </div>
            <Button
              size="sm"
              onClick={createPost}
              disabled={!newPost.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              Publicar
            </Button>
          </div>
        </div>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10">
            <div className="p-4 space-y-3">
              {/* Post Header */}
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {post.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold text-white">{post.author.name}</div>
                  <div className="text-xs text-gray-400">
                    {post.author.level} • {post.timestamp}
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-sm leading-relaxed text-white">{post.content}</p>

              {/* Post Image */}
              {post.image && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-2 text-sm transition-colors ${
                    post.liked
                      ? "text-pink-500"
                      : "text-gray-400 hover:text-pink-500"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${post.liked ? "fill-current" : ""}`}
                  />
                  <span>{post.likes}</span>
                </button>

                <button 
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.comments.length}</span>
                </button>
              </div>

              {/* Comments Section */}
              {post.showComments && (
                <div className="space-y-3 pt-3 border-t border-white/10">
                  {/* Existing Comments */}
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2 bg-gray-800/50 p-3 rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-purple-500 text-white text-xs">
                          {comment.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm">{comment.author}</span>
                          <span className="text-xs text-gray-400">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-300 mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))}

                  {/* Add Comment */}
                  <div className="flex gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-500 text-white text-xs">EU</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <Input
                        placeholder="Escreva um comentário..."
                        value={commentTexts[post.id] || ""}
                        onChange={(e) => setCommentTexts({ ...commentTexts, [post.id]: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addComment(post.id)
                          }
                        }}
                        className="bg-gray-800/50 border-white/10 text-white text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() => addComment(post.id)}
                        disabled={!commentTexts[post.id]?.trim()}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <Button
        variant="outline"
        className="w-full border-white/10 text-gray-400 hover:bg-white/5"
      >
        Carregar Mais
      </Button>
    </div>
  )
}
