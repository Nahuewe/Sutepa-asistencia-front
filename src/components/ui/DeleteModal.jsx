import React, { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dialog, Transition } from '@headlessui/react'
import Icon from '@/components/ui/Icon'
import { handleShowDelete } from '@/store/layout'
import Button from './Button'

export const DeleteModal = ({
  noFade,
  disableBackdrop,
  className = 'max-w-xl',
  footerContent,
  centered,
  scrollContent,
  themeClass = 'bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700',
  title = 'Delete Modal',
  message,
  labelBtn = 'Aceptar',
  btnFunction
}) => {
  const { showDelete } = useSelector(state => state.layout)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  const closeModal = () => {
    dispatch(handleShowDelete())
  }

  const aceptDelete = async () => {
    setIsLoading(true)
    await btnFunction()
    dispatch(handleShowDelete(false))
    setIsLoading(false)
  }

  const returnNull = () => null

  if (typeof showDelete !== 'boolean') {
    return null
  }

  return (
    <>
      <Transition appear show={showDelete} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-[99999]'
          onClose={!disableBackdrop ? closeModal : returnNull}
        >
          {!disableBackdrop && (
            <Transition.Child
              as={Fragment}
              enter={noFade ? '' : 'duration-300 ease-out'}
              enterFrom={noFade ? '' : 'opacity-0'}
              enterTo={noFade ? '' : 'opacity-100'}
              leave={noFade ? '' : 'duration-200 ease-in'}
              leaveFrom={noFade ? '' : 'opacity-100'}
              leaveTo={noFade ? '' : 'opacity-0'}
            >
              <div className='fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm' />
            </Transition.Child>
          )}

          <div className='fixed inset-0 overflow-y-auto'>
            <div
              className={`flex min-h-full justify-center text-center p-6 ${
                centered ? 'items-center' : 'items-start '
              }`}
            >
              <Transition.Child
                as={Fragment}
                enter={noFade ? '' : 'duration-300  ease-out'}
                enterFrom={noFade ? '' : 'opacity-0 scale-95'}
                enterTo={noFade ? '' : 'opacity-100 scale-100'}
                leave={noFade ? '' : 'duration-200 ease-in'}
                leaveFrom={noFade ? '' : 'opacity-100 scale-100'}
                leaveTo={noFade ? '' : 'opacity-0 scale-95'}
              >
                <Dialog.Panel
                  className={`w-full transform overflow-hidden rounded-md
              bg-white dark:bg-slate-800 text-left align-middle shadow-xl transition-alll ${className}`}
                >
                  <div
                    className={`relative overflow-hidden py-4 px-5 text-white flex justify-between  ${themeClass}`}
                  >
                    <h2 className='capitalize leading-6 tracking-wider font-medium text-base text-white'>
                      {title}
                    </h2>
                    <button onClick={closeModal} className='text-[22px]'>
                      <Icon icon='heroicons-outline:x' />
                    </button>
                  </div>
                  <div
                    className={`px-6 py-4 ${
                      scrollContent ? 'overflow-y-auto max-h-[400px]' : ''
                    }`}
                  >
                    {/* Content */}
                    <p className='text-center mb-4'>{message}</p>
                    <div className='flex justify-center gap-4'>
                      <button className='btn inline-flex justify-center btn-danger px-12' onClick={closeModal}>Cancelar</button>
                      <Button type='button' onClick={aceptDelete} text={labelBtn} className={`btn-success ${!isLoading && 'px-12'}`} isLoading={isLoading} />
                    </div>
                  </div>
                  {footerContent && (
                    <div className='px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700'>
                      {footerContent}
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
