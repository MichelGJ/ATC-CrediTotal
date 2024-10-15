import { Request, Response } from 'express';
import { TicketService } from '../services/ticket.service';



export class TicketController {

  // DI - WssService
  constructor(
    private readonly ticketService = new TicketService(),
  ) { }


  public getTickets = async (req: Request, res: Response) => {
    res.json(this.ticketService.tickets);
  }

  public getLastTicketNumber = async (req: Request, res: Response) => {
    res.json(this.ticketService.lastTicketNumber);
  }

  public pendingTickets = async (req: Request, res: Response) => {
    res.json(this.ticketService.pendingTickets);
  }

  public createTicket = async (req: Request, res: Response) => {
    const { userId } = req.body;
    res.status(201).json(this.ticketService.createTicket(userId));
  }

  public drawTicket = async (req: Request, res: Response) => {
    const { desk } = req.params;
    res.json(this.ticketService.drawTicket(desk));
  }

  public ticketFinished = async (req: Request, res: Response) => {
    const { ticketId } = req.params;

    const result = await this.ticketService.onFinishedTicket(ticketId); // Await the result if it's a Promise

    res.json(result); // Send the result as the response
  }

  public workingOn = async (req: Request, res: Response) => {
    res.json(this.ticketService.lastWorkingOnTickets);
  }



} 