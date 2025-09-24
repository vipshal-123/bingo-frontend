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
            'absolute inset-0 flex items-center justify-center '

        if (isStruck) {
            baseStyle += 'bg-white text-black border-2 border-white '
        } else {
            baseStyle += 'bg-primary-500 text-white '
        }

        return baseStyle
    }

    const getCellStyle = (number: number, rowIndex: number, colIndex: number) => {
        const isMarked = marked && marked[rowIndex] && marked[rowIndex][colIndex]
        const isCalled = calledNumbers.includes(number)
        const isPendingProposalNumber = pendingProposal?.number === number
        const isOpponentProposal = pendingProposal && !isMyProposal
        const isMyPendingProposal = pendingProposal && isMyProposal
        const isRowStruck = strikes.rows[rowIndex]
        const isColumnStruck = strikes.columns[colIndex]

        let baseStyle =
            'aspect-square flex items-center justify-center text-sm sm:text-base font-semibold rounded-lg border-2 transition-all duration-200 select-none relative '

        if (isRowStruck || isColumnStruck) {
            baseStyle += 'bg-red-500 text-white border-red-600 shadow-lg cursor-not-allowed '
        } else if (isMarked) {
            baseStyle += 'bg-green-500 text-white border-green-600 shadow-lg cursor-not-allowed '
        } else if (isPendingProposalNumber && isOpponentProposal) {
            baseStyle += 'bg-orange-400 text-white border-orange-500 shadow-lg animate-pulse cursor-pointer '
        } else if (isPendingProposalNumber && isMyPendingProposal) {
            baseStyle += 'bg-purple-400 text-white border-purple-500 shadow-lg animate-pulse cursor-not-allowed '
        } else if (isCalled) {
            baseStyle += 'bg-yellow-400 text-gray-800 border-yellow-500 shadow-md cursor-not-allowed '
        } else if (isOpponentProposal) {
            baseStyle += 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50 '
        } else if (isMyPendingProposal) {
            baseStyle += 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50 '
        } else if (isMyTurn && !disabled) {
            baseStyle += 'bg-white hover:bg-blue-50 text-gray-800 border-gray-300 hover:border-blue-400 hover:shadow-md cursor-pointer '
        } else {
            baseStyle += 'bg-gray-100 text-gray-600 border-gray-200 cursor-not-allowed '
        }

        return baseStyle
    }

    const getGridCols = () => {
        return boardType === '5x5' ? 'grid-cols-6' : 'grid-cols-11' // +1 for strike buttons
    }

    if (!marked || !Array.isArray(marked) || !strikes || !bingoWord) {
        console.warn('Board data not properly initialized:', { marked, strikes, bingoWord })
        return <div className='text-center p-4'>Loading board...</div>
    }

    return (
        <div className='w-full max-w-4xl mx-auto'>
            <div className={`grid ${getGridCols()} gap-1 sm:gap-2 mb-2`}>
                <div></div>

                {boardType === '5x5'
                    ? bingoLetters.map((letter, index) => (
                          <div key={letter} className='aspect-square flex items-center justify-center text-sm sm:text-base font-semibold rounded-lg border-2 transition-all duration-200 select-none relative text-white shadow-lg '>
                              {completableColumns.includes(index) && (
                                  <button
                                      onClick={() => onStrikeColumn(index)}
                                      className='w-6 h-6 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 transition-colors'
                                      title={`Strike column ${letter} (auto-strikes next BINGO letter)`}
                                      disabled={disabled}
                                  >
                                      ✗
                                  </button>
                              )}

                              <div className={getBingoLetterStyle(letter)}>
                                  {letter}
                                  {bingoWord[letter] && (
                                      <div className='absolute inset-0 flex items-center justify-center'>
                                          <div className='w-full h-0.5 bg-black opacity-80 transform rotate-45'></div>
                                          {/* <div className='w-full h-0.5 bg-white opacity-80 transform -rotate-45 absolute'></div> */}
                                      </div>
                                  )}
                              </div>
                          </div>
                      ))
                    : Array.from({ length: 10 }).map((_, index) => (
                          <div key={index} className='flex flex-col items-center gap-1'>
                              {completableColumns.includes(index) && (
                                  <button
                                      onClick={() => onStrikeColumn(index)}
                                      className='w-6 h-6 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 transition-colors'
                                      title={`Strike column ${index + 1} (auto-strikes next BINGO letter)`}
                                      disabled={disabled}
                                  >
                                      ✗
                                  </button>
                              )}

                              <div className='aspect-square flex items-center justify-center bg-gray-300 text-gray-600 font-bold text-sm sm:text-lg rounded-lg shadow-lg'>
                                  {index + 1}
                              </div>
                          </div>
                      ))}
            </div>

            <div className={`grid ${getGridCols()} gap-1 sm:gap-2`}>
                {board.map((row, rowIndex) => (
                    <React.Fragment key={`row-${rowIndex}`}>
                        <div className='flex items-center justify-center'>
                            {completableRows.includes(rowIndex) && (
                                <button
                                    onClick={() => onStrikeRow(rowIndex)}
                                    className='w-6 h-6 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 transition-colors'
                                    title={`Strike row ${rowIndex + 1} (auto-strikes next BINGO letter)`}
                                    disabled={disabled}
                                >
                                    ✗
                                </button>
                            )}
                        </div>

                        {row.map((number, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={getCellStyle(number, rowIndex, colIndex)}
                                onClick={() => handleCellClick(number, rowIndex, colIndex)}
                                title={
                                    strikes.rows[rowIndex] || strikes.columns[colIndex]
                                        ? 'Struck - cannot be used'
                                        : marked && marked[rowIndex] && marked[rowIndex][colIndex]
                                        ? 'Already marked - cannot propose'
                                        : `Number ${number}`
                                }
                            >
                                {number}
                                {(strikes.rows[rowIndex] || strikes.columns[colIndex]) && (
                                    <div className='absolute inset-0 flex items-center justify-center'>
                                        <div className={`${strikes.rows[rowIndex] ? 'w-full h-0.5' : 'w-0.5 h-full'} bg-white opacity-80`}></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>

            {(completableRows.length > 0 || completableColumns.length > 0) && (
                <div className='mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
                    <p className='text-yellow-800 font-medium text-center'>
                        ⚡ You can strike: {completableRows.length} row(s) and {completableColumns.length} column(s)
                    </p>
                    <p className='text-yellow-600 text-sm text-center mt-1'>Each strike automatically marks the next BINGO letter!</p>
                </div>
            )}

            {/* <div className='mt-4 flex flex-wrap gap-2 text-xs sm:text-sm'>
                <div className='flex items-center'>
                    <div className='w-4 h-4 bg-green-500 rounded mr-2'></div>
                    <span>Marked</span>
                </div>
                <div className='flex items-center'>
                    <div className='w-4 h-4 bg-red-500 rounded mr-2'></div>
                    <span>Struck (BINGO Letter Auto-Marked)</span>
                </div>
                <div className='flex items-center'>
                    <div className='w-4 h-4 bg-orange-400 rounded mr-2'></div>
                    <span>Opponent's Proposal</span>
                </div>
                <div className='flex items-center'>
                    <div className='w-4 h-4 bg-purple-400 rounded mr-2'></div>
                    <span>Your Proposal</span>
                </div>
                <div className='flex items-center'>
                    <div className='w-4 h-4 bg-yellow-400 rounded mr-2'></div>
                    <span>Called</span>
                </div>
                <div className='flex items-center'>
                    <div className='w-4 h-4 bg-white border border-gray-300 rounded mr-2'></div>
                    <span>Available</span>
                </div>
            </div> */}

        </div>
    )
}

export default BingoBoard
