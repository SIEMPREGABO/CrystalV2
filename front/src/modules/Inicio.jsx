import React, { useContext } from 'react'
import {GoDotFill} from 'react-icons/go';
import {Stacked, Pie,Button, SparkLine} from '../components';
import { earningData, SparklineAreaData, ecomPieChartData } from '../data/dummy';
import { useStateContext } from '../context/Provider';

 const Inicio = () => {
  const {currentColor} = useStateContext();
  return (
    <div className="mt-24">
      <div className="flex flex-wrap lg:flex-nowrap justify-center ">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-gradient-to-r from-cyan-500 to-blue-500 bg-no-repeat bg-cover bg-center">
          <div className="flex justify-between items-center">
              <div>
                <p className='font-bold text-gray-400'> Algo aqui</p>
                <p className='text-2xl'>Algo aca </p>
              </div>

            </div>
            <div className='mt-6'>
                <Button color="black" bgColor = {currentColor} text = "Download" borderRadius = "10px" size="md" />
            </div>
          </div>
        <div  className='flex m-3 flex-wrap justify-center gap-1 items-center'>
          {earningData.map((item)=> (
            <div key = {item.title} className = 'bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md=:w-56 p-4 pt-9 rounded-2xl'>
                <button type='button' style={{color:item.iconColor, backgroundColor: item.iconBg}} className='text -2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl'>
                  {item.icon }
                </button>
                <p className='mt-3'>
                  <span className='text-lg font-semibold'> 
                      {item.amount} 
                  </span>
                  </p>
                  <span className={`text-sm text-${item.pcColor} ml-2`}>
                    {item.percentage}
                  </span>
                  <p className='text-sm  text-gray-400 mt-1'>{item.title}</p>
                
            </div>
          ))}
          </div>  
      </div>
      <div className='flex gap-10 flex-wrap justify-center '>
          <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3  rounded-2xl md:w-780'>
            <p className='font-semibold text-xl'> Avance de proyecto</p>
            <div className='flex items-center gap-4'>
              <p className='flex items-center gap-2 text-gray-600 hover:drop-shadow-xl'>
                <span>
                  <GoDotFill/>
                </span>
                <span>Algo aca</span>
              </p>

            </div>
          </div>
      </div>       
    </div>
  )
}

export default Inicio;
