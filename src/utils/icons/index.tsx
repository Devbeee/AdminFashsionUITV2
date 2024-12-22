import { FaGear, FaRegUser } from 'react-icons/fa6'
import { MdMenu, MdOutlineWatchLater, MdOutlineLibraryAdd, MdOutlineProductionQuantityLimits, MdOutlineInventory2, MdOutlineImage } from 'react-icons/md'
import { IoHomeOutline, IoSearch, IoCreateOutline  } from 'react-icons/io5'
import { RxSlash } from 'react-icons/rx'
import { FaPlus, FaRegTrashAlt, FaUser, FaFilter } from "react-icons/fa";
import { CgDanger } from "react-icons/cg";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FaSortAmountDown } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { LuSearch } from "react-icons/lu";
import { IoMdClose, IoIosList, IoIosColorWand } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiLogOut, FiBox, FiDollarSign, FiPercent, FiTag, FiLayers, FiGrid, FiBookOpen } from 'react-icons/fi'
import { CiViewList } from "react-icons/ci";

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
  sort: <FaSortAmountDown />,
  close: <IoIosClose />,
  addProduct: <MdOutlineLibraryAdd size={20} color="white"/>,
  searchProduct: <LuSearch size={20} color="gray" className="pb-1"/>,
  closePopup: <IoMdClose />,
  list: <IoIosList size={20} color="black"/>,
  deleteProduct: <RiDeleteBin6Line color='red'/>,
  filter: <FaFilter color='gray'/>,
  logout: <FiLogOut />,
  product: <MdOutlineProductionQuantityLimits/>,
  productName: <FiBox />,
  productPrice: <FiDollarSign />,
  productDiscount: <FiPercent />,
  productCategory: <FiTag />,
  productSize: <FiLayers />,
  numberOfColor: <FiGrid />,
  productDescription: <FiBookOpen />,
  productColor: <IoIosColorWand />,
  productStock: <MdOutlineInventory2/>,
  productImage: <MdOutlineImage />
  create: <IoCreateOutline />,
  blogList: <CiViewList />,
}