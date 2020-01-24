using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.Users
{
    public class List
    {
        public class Command : IRequest
        {
            // to-do fill it with object props
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                this._context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var result = await _context.SaveChangesAsync() > 0;

                if (result) return Unit.Value;

                throw new Exception("Problem saving changes.");

            }
        }
    }
}