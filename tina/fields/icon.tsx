'use client';
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import React from 'react';
import { AiFillInstagram } from 'react-icons/ai';
import * as BoxIcons from 'react-icons/bi';
import { BiChevronRight } from 'react-icons/bi';
import { FaFacebookF, FaGithub, FaLinkedin, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { GoCircleSlash } from 'react-icons/go';
import { Button, wrapFieldsWithMeta } from 'tinacms';
import { ColorPickerInput } from './color';

const IconOptions = {
  Tina: (props: any) => (
    <svg {...props} viewBox='0 0 66 80' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <title>Tina</title>
      <path
        d='M39.4615 36.1782C42.763 33.4475 44.2259 17.3098 45.6551 11.5091C47.0843 5.70828 52.995 6.0025 52.995 6.0025C52.995 6.0025 51.4605 8.67299 52.0864 10.6658C52.7123 12.6587 57 14.4401 57 14.4401L56.0752 16.8781C56.0752 16.8781 54.1441 16.631 52.995 18.9297C51.8459 21.2283 53.7336 43.9882 53.7336 43.9882C53.7336 43.9882 46.8271 57.6106 46.8271 63.3621C46.8271 69.1136 49.5495 73.9338 49.5495 73.9338H45.7293C45.7293 73.9338 40.1252 67.2648 38.9759 63.9318C37.8266 60.5988 38.2861 57.2658 38.2861 57.2658C38.2861 57.2658 32.1946 56.921 26.7931 57.2658C21.3915 57.6106 17.7892 62.2539 17.1391 64.8512C16.4889 67.4486 16.2196 73.9338 16.2196 73.9338H13.1991C11.3606 68.2603 9.90043 66.2269 10.6925 63.3621C12.8866 55.4269 12.4557 50.9263 11.9476 48.9217C11.4396 46.9172 8 45.1676 8 45.1676C9.68492 41.7349 11.4048 40.0854 18.8029 39.9133C26.201 39.7413 36.1599 38.9088 39.4615 36.1782Z'
        fill='currentColor'
      />
      <path
        d='M20.25 63.03C20.25 63.03 21.0305 70.2533 25.1773 73.9342H28.7309C25.1773 69.9085 24.7897 59.415 24.7897 59.415C22.9822 60.0035 20.4799 62.1106 20.25 63.03Z'
        fill='currentColor'
      />
    </svg>
  ),
  ...BoxIcons,
  FaFacebookF,
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
  AiFillInstagram,
};

const parseIconName = (name: string) => {
  const splitName = name.split(/(?=[A-Z])/);
  if (splitName.length > 1) {
    return splitName.slice(1).join(' ');
  } else {
    return name;
  }
};

export const IconPickerInput = wrapFieldsWithMeta(({ input }) => {
  const [filter, setFilter] = React.useState('');
  const filteredBlocks = React.useMemo(() => {
    return Object.keys(IconOptions).filter((name) => {
      return name.toLowerCase().includes(filter.toLowerCase());
    });
  }, [filter]);

  const hasSelectedIcon = Object.prototype.hasOwnProperty.call(IconOptions, input.value);
  const inputLabel = hasSelectedIcon ? parseIconName(input.value) : 'Select Icon';
  const InputIcon = hasSelectedIcon ? IconOptions[input.value as keyof typeof IconOptions] : null;

  return (
    <div className='relative z-[1000]'>
      <input type='text' id={input.name} className='hidden' {...input} />
      <Popover>
        {({ open }) => (
          <>
            <PopoverButton>
              <Button className={`text-sm h-11 px-4 ${InputIcon ? 'h-11' : 'h-10'}`} size='custom' rounded='full' variant={open ? 'secondary' : 'white'}>
                {InputIcon && <InputIcon className='w-7 mr-1 h-auto fill-current text-blue-500' />}
                {inputLabel}
                {!InputIcon && <BiChevronRight className='w-5 h-auto fill-current opacity-70 ml-1' />}
              </Button>
            </PopoverButton>
            <div className='absolute w-full min-w-[192px] max-w-2xl -bottom-2 left-0 translate-y-full' style={{ zIndex: 1000 }}>
              <Transition
                enter='transition duration-150 ease-out'
                enterFrom='transform opacity-0 -translate-y-2'
                enterTo='transform opacity-100 translate-y-0'
                leave='transition duration-75 ease-in'
                leaveFrom='transform opacity-100 translate-y-0'
                leaveTo='transform opacity-0 -translate-y-2'
              >
                <PopoverPanel className='relative overflow-hidden rounded-lg shadow-lg bg-white border border-gray-150 z-50'>
                  {({ close }) => (
                    <div className='max-h-[24rem] flex flex-col w-full h-full'>
                      <div className='bg-gray-50 p-2 border-b border-gray-100 z-10 shadow-sm'>
                        <input
                          type='text'
                          className='bg-white text-sm rounded-sm border border-gray-100 shadow-inner py-1.5 px-2.5 w-full block placeholder-gray-200'
                          onClick={(event: any) => {
                            event.stopPropagation();
                            event.preventDefault();
                          }}
                          value={filter}
                          onChange={(event: any) => {
                            setFilter(event.target.value);
                          }}
                          placeholder='Filter...'
                        />
                      </div>
                      {filteredBlocks.length === 0 && (
                        <span className='relative text-center text-xs px-2 py-3 text-gray-300 bg-gray-50 italic'>No matches found</span>
                      )}
                      {filteredBlocks.length > 0 && (
                        <div className='w-full grid grid-cols-6 auto-rows-auto p-2 overflow-y-auto'>
                          <button
                            className='relative rounded-lg text-center text-xs py-2 px-3 flex-1 outline-none transition-all ease-out duration-150 hover:text-blue-500 focus:text-blue-500 focus:bg-gray-50 hover:bg-gray-50'
                            key={'clear-input'}
                            onClick={() => {
                              input.onChange('');
                              setFilter('');
                              close();
                            }}
                          >
                            <GoCircleSlash className='w-6 h-auto text-gray-200' />
                          </button>
                          {filteredBlocks.map((name) => {
                            return (
                              <button
                                className='relative flex items-center justify-center rounded-lg text-center text-xs py-2 px-3 flex-1 outline-none transition-all ease-out duration-150 hover:text-blue-500 focus:text-blue-500 focus:bg-gray-50 hover:bg-gray-50'
                                key={name}
                                onClick={() => {
                                  input.onChange(name);
                                  setFilter('');
                                  close();
                                }}
                              >
                                {(() => {
                                  const PreviewIcon = IconOptions[name as keyof typeof IconOptions];

                                  return PreviewIcon ? <PreviewIcon className='h-auto w-7 text-blue-500' /> : null;
                                })()}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </PopoverPanel>
              </Transition>
            </div>
          </>
        )}
      </Popover>
    </div>
  );
});

export const iconSchema = {
  type: 'object',
  label: 'Icon',
  name: 'icon',
  fields: [
    {
      type: 'string',
      label: 'Icon',
      name: 'name',
      ui: {
        component: IconPickerInput,
      },
    },
    {
      type: 'string',
      label: 'Color',
      name: 'color',
      ui: {
        component: ColorPickerInput,
      },
    },
    {
      name: 'style',
      label: 'Style',
      type: 'string',
      options: [
        {
          label: 'Circle',
          value: 'circle',
        },
        {
          label: 'Float',
          value: 'float',
        },
      ],
    },
  ],
};
