import React from 'react'
import type { Player, PendingProposal, BingoWord } from '@/types/game.types'
import { getCompletableRows, getCompletableColumns } from '@/utils/game.utils'

interface BingoBoardProps {
    player: Player
    calledNumbers: number[]
    onNumberClick: (number: number) => void
    onConfirmProposal: () => void
    onStrikeRow: (rowIndex: number) => void
    onStrikeColumn: (colIndex: number) => void
    pendingProposal?: PendingProposal | null
    isMyTurn: boolean
    isMyProposal: boolean
    disabled?: boolean
}

const BingoBoard: React.FC<BingoBoardProps> = ({
    player,
    calledNumbers,
    onNumberClick,
    onConfirmProposal,
    onStrikeRow,
    onStrikeColumn,
    pendingProposal,
    isMyTurn,
    isMyProposal,
    disabled = false,
}) => {
    const { board, marked, strikes, bingoWord } = player
    console.log('bingoWord: ', bingoWord)
    const boardType = player.boardType
    const bingoLetters: (keyof BingoWord)[] = ['B', 'I', 'N', 'G', 'O']

    const completableRows = getCompletableRows(marked, strikes)
    const completableColumns = getCompletableColumns(marked, strikes, boardType)

    const handleCellClick = (number: number, rowIndex: number, colIndex: number) => {
        const isMarked = marked && marked[rowIndex] && marked[rowIndex][colIndex]

        if (isMarked) {
            console.log(`Number ${number} is already marked and cannot be proposed again`)
            return
        }

        if (pendingProposal && !isMyProposal) {
            if (number === pendingProposal.number) {
                onConfirmProposal()
                return
            } else {
                console.log(`Only number ${pendingProposal.number} can be confirmed right now`)
                return
            }
        }

        if (disabled || !isMyTurn) {
            console.log('Cannot propose number - not your turn or disabled')
            return
        }

        if (pendingProposal && isMyProposal) {
            console.log('Cannot propose another number while waiting for current proposal to be confirmed')
            return
        }

        onNumberClick(number)
    }

    const getBingoLetterStyle = (letter: keyof BingoWord) => {
        const isStruck = bingoWord[letter]
        let baseStyle =
            'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center text-xs sm:text-sm md:text-base font-bold rounded-lg border-2 transition-all duration-300 select-none relative shadow-sm '

        if (isStruck) {
            baseStyle += 'bg-gradient-to-br from-purple-500 to-purple-600 text-white border-purple-400 shadow-lg transform scale-110'
        } else {
            baseStyle += 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 border-slate-400'
        }

        return baseStyle
    }

    const getCellStyle = (number: number, rowIndex: number, colIndex: number) => {
        const isMarked = marked?.[rowIndex]?.[colIndex]
        const isCalled = calledNumbers.includes(number)
        const isPendingProposalNumber = pendingProposal?.number === number
        const isOpponentProposal = pendingProposal && !isMyProposal
        const isMyPendingProposal = pendingProposal && isMyProposal
        const isRowStruck = strikes.rows[rowIndex]
        const isColumnStruck = strikes.columns[colIndex]
        // const canStrike = completableRows.includes(rowIndex) || completableColumns.includes(colIndex)

        const baseStyle =
            'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center text-xs sm:text-sm md:text-base font-bold rounded-lg border-2 transition-all duration-300 select-none relative overflow-hidden active:scale-95 '

        if (isRowStruck || isColumnStruck) {
            return baseStyle + 'bg-gradient-to-br from-slate-600 to-slate-700 text-white/80 border-slate-500 shadow-inner cursor-not-allowed'
        }
        if (isMarked) {
            return (
                baseStyle +
                'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-emerald-400 shadow-lg cursor-not-allowed transform scale-105'
            )
        }
        if (isPendingProposalNumber && isOpponentProposal) {
            return (
                baseStyle +
                'bg-gradient-to-br from-amber-400 to-amber-500 text-slate-900 border-amber-300 shadow-xl animate-bounce cursor-pointer ring-2 ring-amber-300'
            )
        }
        if (isPendingProposalNumber && isMyPendingProposal) {
            return (
                baseStyle + 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-indigo-400 shadow-lg animate-pulse cursor-not-allowed'
            )
        }
        if (isCalled) {
            return baseStyle + 'bg-gradient-to-br from-yellow-300 to-yellow-400 text-slate-800 border-yellow-200 shadow-sm cursor-not-allowed'
        }
        if (isOpponentProposal || isMyPendingProposal) {
            return baseStyle + 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-60'
        }
        if (isMyTurn && !disabled) {
            return (
                baseStyle +
                'bg-gradient-to-br from-white to-blue-50 hover:from-sky-100 hover:to-sky-200 text-slate-700 border-slate-300 hover:border-sky-400 hover:shadow-lg cursor-pointer transform hover:scale-105 hover:-translate-y-0.5'
            )
        }
        return baseStyle + 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600 border-slate-200 cursor-not-allowed'
    }

    const getGridCols = () => (boardType === '5x5' ? 'grid-cols-5' : 'grid-cols-10')

    if (!marked || !Array.isArray(marked) || !strikes || !bingoWord) {
        return (
            <div className='text-center p-6 sm:p-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl shadow-inner'>
                <div className='animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2'></div>
                <span className='text-sm text-slate-600'>Loading board...</span>
            </div>
        )
    }

    const StrikeIcon = ({ onClick, title, position }: { onClick: () => void; title: string; position: 'row' | 'col' }) => (
        <button
            onClick={onClick}
            className={`absolute ${position === 'row' ? '-right-1 top-1/2 -translate-y-1/2' : 'top-0 left-1/2 -translate-x-1/2'} 
                       w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-rose-500 to-rose-600 text-white text-xs font-bold 
                       rounded-full shadow-lg hover:from-rose-600 hover:to-rose-700 disabled:from-rose-300 disabled:to-rose-400 
                       disabled:cursor-not-allowed transition-all transform hover:scale-110 active:scale-95 z-10`}
            title={title}
            aria-label={title}
            disabled={disabled}
        >
            ✗
        </button>
    )

    return (
        <div className='space-y-3 sm:space-y-4'>
            {boardType === '5x5' && (
                <div className='grid grid-cols-5 gap-1 sm:gap-2 px-3'>
                    {bingoLetters.map((letter, index) => (
                        <div key={`header-${letter}`} className='relative'>
                            {completableColumns.includes(index) && (
                                <StrikeIcon onClick={() => onStrikeColumn(index)} title={`Strike column ${letter}`} position='col' />
                            )}
                            <div className={getBingoLetterStyle(letter)}>
                                {letter}
                                {bingoWord[letter] && (
                                    <div className='absolute inset-0 flex items-center justify-center'>
                                        <div className='h-0.5 bg-white/90 transform -rotate-45 rounded-full' />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div
                className={`grid ${getGridCols()} gap-1 sm:gap-2 p-2 sm:p-3 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/20`}
            >
                {board.map((row, rowIndex) => (
                    <React.Fragment key={`row-${rowIndex}`}>
                        {row.map((number, colIndex) => (
                            <div key={`${rowIndex}-${colIndex}`} className='relative'>
                                {/* Row strike button */}
                                {colIndex === 0 && completableRows.includes(rowIndex) && (
                                    <StrikeIcon onClick={() => onStrikeRow(rowIndex)} title={`Strike row ${rowIndex + 1}`} position='row' />
                                )}

                                {boardType !== '5x5' && rowIndex === 0 && completableColumns.includes(colIndex) && (
                                    <StrikeIcon onClick={() => onStrikeColumn(colIndex)} title={`Strike column ${colIndex + 1}`} position='col' />
                                )}

                                <div
                                    className={getCellStyle(number, rowIndex, colIndex)}
                                    onClick={() => handleCellClick(number, rowIndex, colIndex)}
                                    title={marked?.[rowIndex]?.[colIndex] ? `Number ${number} (Marked)` : `Number ${number}`}
                                >
                                    {number}
                                    {(strikes.rows[rowIndex] || strikes.columns[colIndex]) && (
                                        <div className='absolute inset-0 flex items-center justify-center'>
                                            <div
                                                className='bg-white/90 rounded-full shadow-sm'
                                                style={{
                                                    width: strikes.rows[rowIndex] ? '90%' : '2px',
                                                    height: strikes.rows[rowIndex] ? '2px' : '90%',
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>

            {(completableRows.length > 0 || completableColumns.length > 0) && (
                <div className='p-3 sm:p-4 bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-dashed border-yellow-300 rounded-xl text-center shadow-sm'>
                    <div className='flex items-center justify-center gap-2'>
                        <span className='text-lg animate-bounce'>⚡</span>
                        <p className='text-yellow-800 font-medium text-xs sm:text-sm'>
                            Line completed! Tap the{' '}
                            <span className='inline-flex items-center justify-center w-4 h-4 bg-rose-500 text-white text-xs rounded-full'>✗</span>{' '}
                            button to strike it.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BingoBoard
