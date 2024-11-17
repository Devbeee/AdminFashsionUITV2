import { FaGear, FaRegUser } from 'react-icons/fa6'
import { IoHomeOutline, IoSearch } from 'react-icons/io5'
import { MdMenu, MdOutlineWatchLater } from 'react-icons/md'
import { RxSlash } from 'react-icons/rx'
import { FaPlus, FaRegTrashAlt, FaUser } from 'react-icons/fa'
import { CgDanger } from 'react-icons/cg'
import { HiOutlinePencilSquare } from 'react-icons/hi2'
import { FiLogOut } from 'react-icons/fi'
export const icons = {
  menu: <MdMenu />,
  slash: <RxSlash />,
  home: <IoHomeOutline />,
  search: <IoSearch />,
  setting: <FaGear />,
  user: <FaRegUser />,
  add: <FaPlus />,
  delete: <FaRegTrashAlt />,
  danger: <CgDanger size={25} />,
  update: <HiOutlinePencilSquare />,
  faUser: <FaUser />,
  watch: <MdOutlineWatchLater />,
  logout: <FiLogOut />
}
