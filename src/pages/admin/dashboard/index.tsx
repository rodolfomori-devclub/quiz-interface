import { useEffect, useState } from "react"

import { User } from "../../../hooks/user"
import { ToastifyDisplay } from "../../../utils"
import { quizAdminAPI } from "../../../services/api"

import { AdminPrivateHeader } from "../../../components/AdminPrivateHeader"

import { CiSettings } from "react-icons/ci"
import { ImSpinner3 } from "react-icons/im"
import { BsFiletypeXlsx } from "react-icons/bs"
import { RiSendPlane2Line } from "react-icons/ri"

import * as XLSX from 'xlsx'

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchUser, setSearchUser] = useState<string>('')

  const [loadingFilter, setLoadingFilter] = useState<boolean>(false)

  const handleQueryUsers = async (): Promise<void> => {
    try {
      const response = await quizAdminAPI('/admin/list-users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 200) {
        setUsers(response.data)
        setFilteredUsers(response.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const exportToXLSX = (): void => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredUsers.map((user, index) => ({
        "#": index + 1,
        "Nome Completo": user.name,
        "CPF": user.document,
        "Telefone": user.phone,
        "Nota": user.finalGrade !== null ? user.finalGrade : 'Não preenchido',
      }))
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuários")
    XLSX.writeFile(workbook, "usuarios_quiz.xlsx")

    ToastifyDisplay({ toastType: 'success', message: 'Exportação realizada com sucesso.' })()
  }

  const handleSearch = () => {
    setLoadingFilter(true)

    setTimeout(() => {
      if (searchUser.trim() === '') {
        setFilteredUsers(users)
        setLoadingFilter(false)
      } else {
        const filtered = users.filter(user =>
          user.name!.toLowerCase().includes(searchUser.toLowerCase())
        )
        setFilteredUsers(filtered)
        setLoadingFilter(false)
      }
    }, 1000)
  }

  useEffect(() => {
    handleQueryUsers()
  }, [])

  return (
    <div className="w-full min-h-screen">
      <AdminPrivateHeader />
      <div className="w-full p-4 flex-grow min-lg:max-w-[868px] min-lg:mx-auto mt-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-zinc-600">Dashboard</h3>
          <div className="flex items-center gap-2">
            <CiSettings size={24} className="text-zinc-600 cursor-pointer hover:opacity-80 transition-all" title="Configurações" />
            <BsFiletypeXlsx size={20} className="text-zinc-600 cursor-pointer hover:opacity-80 transition-all" title="Exportar tabela de usuários" onClick={exportToXLSX} />
          </div>
        </div>
        <hr />

        <div className="mt-4 flex flex-col gap-4">
          <p className="text-zinc-600 text-sm min-lg:text-base">
            Qtd. Total: <strong>({filteredUsers?.length})</strong>
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchUser}
              onChange={e => setSearchUser(e.target.value)}
              placeholder="Pesquisar por nome de usuário..."
              className="text-xs border bg-slate-100 p-1 w-80 outline-none pl-2 pr-4 h-8"
              maxLength={128}
              autoComplete="true"
            />

            {loadingFilter ?
              <ImSpinner3 size={18} className="text-zinc-600 animate-spin" />
              :
              <RiSendPlane2Line
                size={20}
                className="text-zinc-600 cursor-pointer hover:opacity-80 transition-all"
                title="Pesquisar"
                onClick={handleSearch}
              />
            }
          </div>
        </div>

        <div className="w-full overflow-x-auto mt-4">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left text-sm min-lg:text-base text-zinc-700">#</th>
                <th className="py-2 px-4 border-b text-left text-sm min-lg:text-base text-zinc-700">Nome</th>
                <th className="py-2 px-4 border-b text-left text-sm min-lg:text-base text-zinc-700">CPF</th>
                <th className="py-2 px-4 border-b text-left text-sm min-lg:text-base text-zinc-700">Telefone</th>
                <th className="py-2 px-4 border-b text-left text-sm min-lg:text-base text-zinc-700">Nota QUIZ</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td className="py-2 px-4 border-b text-sm min-lg:text-base">{index + 1}</td>
                  <td className="py-2 px-4 border-b text-sm min-lg:text-base max-w-[280px] truncate">{user.name}</td>
                  <td className="py-2 px-4 border-b text-sm min-lg:text-base">{user.document!.slice(0, 3)}***</td>
                  <td className="py-2 px-4 border-b text-sm min-lg:text-base">{user.phone!.slice(0, 7)}****</td>
                  <td className="py-2 px-4 border-b text-xs min-lg:text-sm">{user.finalGrade !== -1 ? user.finalGrade : 'Não preenchido'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
